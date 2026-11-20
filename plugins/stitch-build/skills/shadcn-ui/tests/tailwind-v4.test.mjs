import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const verifier = fileURLToPath(new URL('../scripts/verify-setup.sh', import.meta.url));

function fixture({ legacy = false, cssPath = 'src/index.css', css } = {}) {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'stitch-tailwind-'));
  const write = (name, contents) => { mkdirSync(path.dirname(path.join(directory, name)), { recursive: true }); writeFileSync(path.join(directory, name), contents); };
  write('components.json', JSON.stringify({ tailwind: { config: legacy ? 'tailwind.config.js' : '', css: cssPath, cssVariables: true } }));
  write('package.json', JSON.stringify({ dependencies: { react: '^19.0.0', tailwindcss: legacy ? '^3.4.0' : '^4.0.0' } }));
  write(cssPath, css ?? (legacy ? '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n:root { --primary: red; }' : '@import "tailwindcss";\n@theme { --color-primary: red; }'));
  write('src/lib/utils.ts', 'export function cn(...args) { return args; }');
  write('tsconfig.json', '{"compilerOptions":{"paths":{"@/*":["./src/*"]}}}');
  mkdirSync(path.join(directory, 'src/components/ui'), { recursive: true });
  if (legacy) write('tailwind.config.js', 'export default {}');
  try { return spawnSync('bash', [verifier], { cwd: directory, encoding: 'utf8' }); }
  finally { rmSync(directory, { recursive: true, force: true }); }
}

test('accepts Tailwind v4 CSS-first setup without a config file', () => {
  const result = fixture();
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.doesNotMatch(result.stdout, /Tailwind directives missing|Tailwind config\.js not found/);
});

test('uses the CSS file configured by shadcn rather than assuming src/index.css', () => {
  const result = fixture({ cssPath: 'styles/theme.css' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.doesNotMatch(result.stdout, /Global CSS file not found|Tailwind directives missing/);
});

test('keeps supporting Tailwind v3 configuration and directives', () => {
  const result = fixture({ legacy: true });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.doesNotMatch(result.stdout, /Tailwind directives missing|Global CSS file not found/);
});

test('accepts the single-quoted v4 import form', () => {
  const result = fixture({ css: "@import 'tailwindcss';\n@theme { --color-primary: red; }" });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test('does not treat a commented-out import as a Tailwind installation', () => {
  const result = fixture({ css: '/* @import "tailwindcss"; */\n:root { --primary: red; }' });
  assert.equal(result.status, 1, result.stdout + result.stderr);
});
