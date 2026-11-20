import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const validator = fileURLToPath(new URL('../scripts/validate.js', import.meta.url));

function validate(markup) {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'stitch-classname-'));
  try {
    const component = path.join(directory, 'Card.tsx');
    writeFileSync(component, `export interface CardProps { readonly enabled: boolean }\nexport function Card({enabled}: CardProps) { return ${markup}; }`);
    return spawnSync(process.execPath, [validator, component], { encoding: 'utf8' });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

for (const markup of [
  '<div className={"bg-[#aabbcc]"} />',
  '<div className={`bg-[#aabbcc]`} />',
  '<div className={enabled ? "text-[#fff]" : "text-brand"} />',
  '<div className={cn("p-2", "bg-[#123456]")} />',
]) {
  test(`rejects raw colors in ${markup}`, () => {
    const result = validate(markup);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stderr, /hardcoded hex/);
  });
}

for (const markup of [
  '<div className={enabled ? "bg-brand" : "bg-muted"} />',
  '<a className={`text-brand`} href="#abc">#ffffff</a>',
]) {
  test(`allows theme classes in ${markup}`, () => {
    const result = validate(markup);
    assert.equal(result.status, 0, result.stdout + result.stderr);
  });
}
