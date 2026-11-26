import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const validator = fileURLToPath(new URL('../scripts/validate.js', import.meta.url));

function validate(source) {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'stitch-calls-'));
  try {
    const component = path.join(directory, 'List.tsx');
    writeFileSync(component, `export interface ListProps { readonly items: readonly string[] }\n${source}`);
    return spawnSync(process.execPath, [validator, component], { encoding: 'utf8' });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

// SWC keeps call arguments and array elements in `{ spread, expression }`
// wrappers and class method bodies in a `function` object. None of them has a
// `type`, and the validator has to look inside all of them.
for (const [name, source, color] of [
  [
    'a map callback',
    'export function List({ items }: ListProps) { return <ul>{items.map((item) => <li key={item} className="bg-[#aabbcc]">{item}</li>)}</ul>; }',
    'bg-[#aabbcc]',
  ],
  [
    'a memo wrapper',
    'export const List = React.memo(function List({ items }: ListProps) { return <ul className="text-[#ff0000]">{items.length}</ul>; });',
    'text-[#ff0000]',
  ],
  [
    'a forwardRef wrapper',
    'export const List = React.forwardRef<HTMLUListElement, ListProps>(({ items }, ref) => <ul ref={ref} className="border-[#00ff00]">{items.length}</ul>);',
    'border-[#00ff00]',
  ],
  [
    'an array element',
    'export function List({ items }: ListProps) { return <ul>{[<li key="first" className="bg-[#123456]">{items[0]}</li>]}</ul>; }',
    'bg-[#123456]',
  ],
  [
    'a class component',
    'export class List extends React.Component<ListProps> { render() { return <ul className="ring-[#abcdef]">{this.props.items.length}</ul>; } }',
    'ring-[#abcdef]',
  ],
]) {
  test(`rejects raw colors in ${name}`, () => {
    const result = validate(source);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stderr, /Found 1 hardcoded hex codes/);
    assert.ok(result.stderr.includes(`- ${color}`), result.stderr);
  });
}

for (const [name, source] of [
  [
    'theme classes in a map callback',
    'export function List({ items }: ListProps) { return <ul>{items.map((item) => <li key={item} className="bg-brand">{item}</li>)}</ul>; }',
  ],
  [
    'theme classes in a memo wrapper',
    'export const List = React.memo(function List({ items }: ListProps) { return <ul className="text-brand">{items.length}</ul>; });',
  ],
  [
    'theme classes in a class component',
    'export class List extends React.Component<ListProps> { render() { return <ul className="ring-brand">{this.props.items.length}</ul>; } }',
  ],
  [
    'a hex string that is a call argument but not a class name',
    'export function List({ items }: ListProps) { return <ul>{items.map((item) => <li key={item} className="bg-brand">{item.replace("#ffffff", "")}</li>)}</ul>; }',
  ],
]) {
  test(`allows ${name}`, () => {
    const result = validate(source);
    assert.equal(result.status, 0, result.stdout + result.stderr);
  });
}
