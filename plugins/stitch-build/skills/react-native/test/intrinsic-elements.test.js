import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const validator = fileURLToPath(new URL('../scripts/validate.js', import.meta.url));
function validate(markup) {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'stitch-native-tags-'));
  try {
    const component = path.join(directory, 'Card.tsx');
    writeFileSync(component, `export interface CardProps { readonly title: string }\nexport function Card({title}: CardProps) { return ${markup}; }`);
    return spawnSync(process.execPath, [validator, component], { encoding: 'utf8' });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}
for (const tag of ['textarea', 'select', 'svg', 'canvas', 'table', 'video']) {
  test(`rejects web-only intrinsic <${tag}>`, () => {
    const result = validate(`<${tag} />`);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stderr, new RegExp(`Found HTML elements: ${tag}`));
  });
}
for (const markup of ['<View><Text>{title}</Text></View>', '<Animated.View />', '<Svg><Path /></Svg>', '<custom-native-view />']) {
  test(`allows native components in ${markup}`, () => {
    const result = validate(markup);
    assert.equal(result.status, 0, result.stdout + result.stderr);
  });
}
