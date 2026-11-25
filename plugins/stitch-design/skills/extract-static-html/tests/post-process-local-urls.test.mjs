import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const script = fileURLToPath(new URL('../scripts/post_process.ts', import.meta.url));

function processFixture(html, assetName, bytes) {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'stitch-local-urls-'));
  try {
    const asset = path.join(directory, assetName);
    mkdirSync(path.dirname(asset), { recursive: true });
    writeFileSync(asset, bytes);
    const output = path.join(directory, 'page.html');
    writeFileSync(output, html);
    const result = spawnSync(process.execPath, [script, output, '--base-dir', directory, '--json'], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    return { html: readFileSync(output, 'utf8'), stdout: result.stdout };
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test('inlines versioned and percent-encoded local URLs', () => {
  const bytes = Buffer.from('local image fixture');
  const expected = `data:image/png;base64,${bytes.toString('base64')}`;
  const result = processFixture('<img src="brand%20mark.png?v=2"><style>.logo{background:url("brand%20mark.png?cache=3")}</style>', 'brand mark.png', bytes);
  assert.equal(result.html.includes('brand%20mark.png'), false);
  assert.equal(result.html.split(expected).length - 1, 2);
});

test('preserves SVG fragments when inlining external SVG images', () => {
  const bytes = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><view id="icon" viewBox="0 0 10 10"/></svg>');
  const expected = `data:image/svg+xml;base64,${bytes.toString('base64')}#icon`;
  const result = processFixture('<img src="icons.svg?v=2#icon"><svg><image href="icons.svg#icon"/></svg><style>.logo{background:url("icons.svg#icon")}</style>', 'icons.svg', bytes);
  assert.equal(result.html.includes('icons.svg'), false);
  assert.equal(result.html.split(expected).length - 1, 3);
});

test('leaves document-local SVG fragment references intact', () => {
  const result = processFixture('<style>.logo{filter:url(#shadow)}</style><svg><filter id="shadow"/></svg>', 'unused.png', 'unused');
  assert.match(result.html, /url\(#shadow\)/);
  assert.match(result.stdout, /"totalSkippedNotFound": 0/);
});

test('escapes apostrophes in unquoted CSS data URLs for SVG fragments', () => {
  const bytes = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><view id="symbol\'s-view"/></svg>');
  const expected = `data:image/svg+xml;base64,${bytes.toString('base64')}#symbol\\27 s-view`;
  const result = processFixture('<style>.icon{background:url("icons.svg#symbol\'s-view")}</style>', 'icons.svg', bytes);
  assert.ok(result.html.includes(`url(${expected})`), result.html);
});

test('preserves already encoded fragments without double encoding', () => {
  const bytes = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>');
  const expected = `data:image/svg+xml;base64,${bytes.toString('base64')}#symbol%27s-view`;
  const result = processFixture('<img src="icons.svg#symbol%27s-view"><style>.icon{background:url("icons.svg#symbol%27s-view")}</style>', 'icons.svg', bytes);
  assert.equal(result.html.split(expected).length - 1, 2);
  assert.doesNotMatch(result.html, /%2527/);
});

test('does not introduce quotes into a double-quoted inline style attribute', () => {
  const bytes = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>');
  const result = processFixture(`<div style="background:url('icons.svg#symbol\\'s-view')"></div>`, 'icons.svg', bytes);
  assert.match(result.html, /^<div style="[^"]*"><\/div>$/);
  assert.ok(result.html.includes("#symbol\\27 s-view"), result.html);
});

test('keeps single-quoted inline style attributes valid', () => {
  const bytes = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>');
  const result = processFixture(`<div style='background:url("icons.svg#symbol%27s-view")'></div>`, 'icons.svg', bytes);
  assert.match(result.html, /^<div style='[^']*'><\/div>$/);
  assert.ok(result.html.includes('#symbol%27s-view'), result.html);
});

test('inlines a leading-slash subdirectory path containing a literal percent escape', () => {
  const bytes = Buffer.from('nested image fixture');
  const html = '<img src="/icons/percent%zz.png?cache=2">';
  const result = processFixture(html, 'icons/percent%zz.png', bytes);
  assert.ok(result.html.includes(`data:image/png;base64,${bytes.toString('base64')}`), result.html);
});

test('does not count versioned script and stylesheet references as missing assets', () => {
  const html = '<script src="app.js?v=2"></script><source src="screen.css?rev=2"><svg><image src="#local"/></svg>';
  const result = processFixture(html, 'unused.png', 'unused');
  assert.equal(result.html, html);
  assert.match(result.stdout, /"totalSkippedNotFound": 0/);
});
