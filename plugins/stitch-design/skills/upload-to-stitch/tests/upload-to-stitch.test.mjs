import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const script = fileURLToPath(new URL('../scripts/upload_to_stitch.py', import.meta.url));
const scriptsDir = path.dirname(script);

// A tiny local API stand-in that records the request and answers 200.
// mode 'json' answers valid JSON; mode 'html' answers a non-UTF-8 HTML page.
function startCaptureServer(mode) {
  let captured = null;
  const server = http.createServer((req, res) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      captured = { url: req.url, body: Buffer.concat(chunks).toString('utf8') };
      const payload = mode === 'html'
        ? Buffer.from('<html><body>gateway page \xff\xfe</body></html>', 'latin1')
        : Buffer.from(JSON.stringify({ screens: [] }));
      res.writeHead(200, { 'content-type': 'application/json', 'content-length': payload.length });
      res.end(payload);
    });
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({
      server,
      port: server.address().port,
      captured: () => captured,
    }));
  });
}

function runUpload({ projectId, file, apiUrl, env }) {
  return spawnSync(
    'python3',
    [script, '--project-id', projectId, '--file-path', file, '--api-key', 'test-key', '--api-url', apiUrl],
    { encoding: 'utf8', timeout: 10000, env: { ...process.env, ...env } },
  );
}

// Async variant for tests that serve the request from a local server on this
// process: spawnSync would block the event loop and deadlock the server.
function runUploadAsync({ projectId, file, apiUrl }) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      'python3',
      [script, '--project-id', projectId, '--file-path', file, '--api-key', 'test-key', '--api-url', apiUrl],
      { timeout: 10000 },
    );
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });
    child.on('error', reject);
    child.on('close', (status) => resolve({ status, stdout, stderr }));
  });
}

test('upload_to_stitch help displays --create-screen-instances flag', () => {
  const res = spawnSync('python3', [script, '--help'], { encoding: 'utf8' });
  assert.equal(res.status, 0, res.stdout + res.stderr);
  assert.match(res.stdout, /--create-screen-instances/);
  assert.match(res.stdout, /--no-create-screen-instances/);
});

test('upload_to_stitch accepts --create-screen-instances and --no-create-screen-instances flags', () => {
  const tmpDir = mkdtempSync(path.join(os.tmpdir(), 'stitch-upload-'));
  try {
    const dummyFile = path.join(tmpDir, 'page.html');
    writeFileSync(dummyFile, '<html><body>test</body></html>');

    for (const flag of ['--create-screen-instances', '--no-create-screen-instances']) {
      // Intentionally provide invalid API endpoint or dummy host so it attempts connection and doesn't crash in argparse
      const res = spawnSync(
        'python3',
        [
          script,
          '--project-id',
          'test-project',
          '--file-path',
          dummyFile,
          '--api-key',
          'test-key',
          '--api-url',
          'http://127.0.0.1:9', // unreachable port to fail at network step, not arg parsing
          flag,
        ],
        { encoding: 'utf8', timeout: 5000 },
      );

      // Should NOT exit with code 2 (argparse error)
      assert.notEqual(res.status, 2, `Failed with argparse error for flag ${flag}:\n${res.stderr}`);
      assert.doesNotMatch(res.stderr, /unrecognized arguments/);
    }
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('upload_to_stitch rejects unsupported file extensions', () => {
  const tmpDir = mkdtempSync(path.join(os.tmpdir(), 'stitch-upload-'));
  try {
    const txtFile = path.join(tmpDir, 'test.txt');
    writeFileSync(txtFile, 'hello');

    const res = spawnSync(
      'python3',
      [script, '--project-id', 'test-project', '--file-path', txtFile, '--api-key', 'test-key'],
      { encoding: 'utf8' },
    );

    assert.equal(res.status, 1);
    assert.match(res.stdout, /Error: Unsupported file type '\.txt'/);
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('upload_to_stitch strips a leading projects/ prefix from --project-id', async () => {
  const tmpDir = mkdtempSync(path.join(os.tmpdir(), 'stitch-upload-'));
  const { server, port, captured } = await startCaptureServer('json');
  try {
    const dummyFile = path.join(tmpDir, 'page.html');
    writeFileSync(dummyFile, '<html><body>test</body></html>');

    const res = await runUploadAsync({
      projectId: 'projects/12345',
      file: dummyFile,
      apiUrl: `http://127.0.0.1:${port}`,
    });

    assert.equal(res.status, 0, res.stdout + res.stderr);
    assert.equal(captured().url, '/v1/projects/12345/screens:batchCreate');
    assert.equal(JSON.parse(captured().body).parent, 'projects/12345');
  } finally {
    server.close();
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('upload_to_stitch rejects an empty project id after stripping the prefix', () => {
  const tmpDir = mkdtempSync(path.join(os.tmpdir(), 'stitch-upload-'));
  try {
    const dummyFile = path.join(tmpDir, 'page.html');
    writeFileSync(dummyFile, '<html><body>test</body></html>');

    const res = runUpload({
      projectId: 'projects/',
      file: dummyFile,
      apiUrl: 'http://127.0.0.1:9',
    });

    assert.equal(res.status, 1);
    assert.match(res.stdout, /Error: --project-id must not be empty/);
    assert.doesNotMatch(res.stderr, /Traceback/);
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('upload_to_stitch rejects a directory passed as --file-path', () => {
  const tmpDir = mkdtempSync(path.join(os.tmpdir(), 'stitch-upload-'));
  try {
    const dirAsFile = path.join(tmpDir, 'dir.html');
    mkdirSync(dirAsFile);

    const res = runUpload({
      projectId: 'test-project',
      file: dirAsFile,
      apiUrl: 'http://127.0.0.1:9',
    });

    assert.equal(res.status, 1);
    assert.match(res.stdout, /Error: Not a file:/);
    assert.doesNotMatch(res.stderr, /Traceback/);
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('upload_to_stitch handles a non-JSON 200 response cleanly', async () => {
  const tmpDir = mkdtempSync(path.join(os.tmpdir(), 'stitch-upload-'));
  const { server, port } = await startCaptureServer('html');
  try {
    const dummyFile = path.join(tmpDir, 'page.html');
    writeFileSync(dummyFile, '<html><body>test</body></html>');

    const res = await runUploadAsync({
      projectId: 'test-project',
      file: dummyFile,
      apiUrl: `http://127.0.0.1:${port}`,
    });

    assert.equal(res.status, 1);
    assert.match(res.stdout, /Error: Response was not valid JSON/);
    assert.doesNotMatch(res.stderr, /Traceback/);
  } finally {
    server.close();
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

// SSL_CERT_FILE must win over certifi: point it at a bundle with a single
// certificate and check the loaded context holds exactly that one.
const certifiCheck = spawnSync('python3', ['-c', 'import certifi; print(certifi.where())'], { encoding: 'utf8' });
const hasCertifi = certifiCheck.status === 0;

test('upload_to_stitch prefers SSL_CERT_FILE over certifi', { skip: !hasCertifi }, () => {
  const tmpDir = mkdtempSync(path.join(os.tmpdir(), 'stitch-upload-'));
  try {
    const bundle = readFileSync(certifiCheck.stdout.trim(), 'utf8');
    const singleCert = path.join(tmpDir, 'one.pem');
    writeFileSync(singleCert, `${bundle.split('-----END CERTIFICATE-----')[0]}-----END CERTIFICATE-----\n`);

    const code = `import sys; sys.path.insert(0, ${JSON.stringify(scriptsDir)}); import upload_to_stitch as m; print(len(m._SSL_CONTEXT.get_ca_certs()))`;
    const res = spawnSync('python3', ['-c', code], {
      encoding: 'utf8',
      env: { ...process.env, SSL_CERT_FILE: singleCert },
    });

    assert.equal(res.status, 0, res.stderr);
    assert.equal(res.stdout.trim(), '1');
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});
