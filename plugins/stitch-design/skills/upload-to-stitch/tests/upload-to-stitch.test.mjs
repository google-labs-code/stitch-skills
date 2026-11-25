import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const script = fileURLToPath(new URL('../scripts/upload_to_stitch.py', import.meta.url));

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
