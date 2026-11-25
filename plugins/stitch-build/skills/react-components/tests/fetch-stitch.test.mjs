import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';

const script = fileURLToPath(new URL('../scripts/fetch-stitch.sh', import.meta.url));

test('fetch-stitch exits with error if arguments are missing', () => {
  const res = spawnSync('bash', [script], { encoding: 'utf8' });
  assert.equal(res.status, 1);
  assert.match(res.stdout, /Usage: .* <url> <output_path>/);
});

test('fetch-stitch creates target directory when downloading to a nested path', () => {
  const tmpDir = mkdtempSync(path.join(os.tmpdir(), 'stitch-fetch-'));
  try {
    const sourceFile = path.join(tmpDir, 'source.html');
    writeFileSync(sourceFile, '<html>hello world</html>');
    const sourceUrl = pathToFileURL(sourceFile).href;

    const nestedOutput = path.join(tmpDir, 'nested', 'designs', 'test.html');
    assert.equal(existsSync(path.dirname(nestedOutput)), false);

    const res = spawnSync('bash', [script, sourceUrl, nestedOutput], {
      encoding: 'utf8',
    });

    assert.equal(res.status, 0, res.stdout + res.stderr);
    assert.equal(existsSync(nestedOutput), true);
    assert.match(readFileSync(nestedOutput, 'utf8'), /<html>hello world<\/html>/);
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});
