import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const verifier = fileURLToPath(new URL('../scripts/verify-setup.sh', import.meta.url));

function fixture({ files = {}, drop = [], deps = { react: '^19.0.0', tailwindcss: '^3.4.0' } } = {}) {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'stitch-verify-exit-'));
  const write = (name, contents) => {
    mkdirSync(path.dirname(path.join(directory, name)), { recursive: true });
    writeFileSync(path.join(directory, name), contents);
  };

  const defaults = {
    'components.json': JSON.stringify({ tailwind: { config: 'tailwind.config.js', css: 'src/index.css', cssVariables: true } }),
    'package.json': JSON.stringify({ dependencies: deps }),
    'tailwind.config.js': 'export default {}',
    'tsconfig.json': '{"compilerOptions":{"paths":{"@/*":["./src/*"]}}}',
    'src/index.css': '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n:root { --primary: red; }',
    'src/lib/utils.ts': 'export function cn(...args) { return args; }',
  };

  for (const [name, contents] of Object.entries({ ...defaults, ...files })) write(name, contents);
  mkdirSync(path.join(directory, 'src/components/ui'), { recursive: true });
  for (const name of drop) rmSync(path.join(directory, name), { recursive: true, force: true });

  try {
    return spawnSync('bash', [verifier], { cwd: directory, encoding: 'utf8' });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test('exits 0 when every requirement is satisfied', () => {
  const result = fixture();
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /Setup verification complete!/);
});

test('fails when the configured global CSS file is missing', () => {
  const result = fixture({ drop: ['src/index.css'] });
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /Global CSS file not found/);
  assert.doesNotMatch(result.stdout, /Setup verification complete!/);
});

test('fails when the global CSS file has no Tailwind directives', () => {
  const result = fixture({ files: { 'src/index.css': ':root { --primary: red; }\n' } });
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /Tailwind directives missing/);
  assert.doesNotMatch(result.stdout, /Setup verification complete!/);
});

test('fails when lib/utils.ts is missing', () => {
  const result = fixture({ drop: ['src/lib/utils.ts'] });
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /lib\/utils\.ts not found/);
  assert.doesNotMatch(result.stdout, /Setup verification complete!/);
});

test('fails when lib/utils.ts does not export the cn helper', () => {
  const result = fixture({ files: { 'src/lib/utils.ts': 'export const cn = undefined;\n' } });
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /cn\(\) utility function missing/);
  assert.doesNotMatch(result.stdout, /Setup verification complete!/);
});

for (const dep of ['react', 'tailwindcss']) {
  test(`fails when the required dependency ${dep} is absent`, () => {
    const deps = { react: '^19.0.0', tailwindcss: '^3.4.0' };
    delete deps[dep];
    const result = fixture({ deps });
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stdout, new RegExp(`${dep} not installed`));
    assert.doesNotMatch(result.stdout, /Setup verification complete!/);
  });
}

test('keeps advisory checks advisory: a missing components/ui directory still exits 0', () => {
  const result = fixture({ drop: ['src/components/ui'] });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /components\/ui directory not found/);
  assert.match(result.stdout, /Setup verification complete!/);
});

test('keeps advisory checks advisory: missing recommended dependencies still exit 0', () => {
  const result = fixture();
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /clsx not installed \(recommended\)/);
  assert.match(result.stdout, /Setup verification complete!/);
});
