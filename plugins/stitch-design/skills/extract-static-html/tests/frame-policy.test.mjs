import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { effectiveOrigin, shouldInlineFrame } from '../scripts/frame_policy.ts';

const snapshotSource = fs.readFileSync(new URL('../scripts/snapshot.ts', import.meta.url), 'utf8');

test('effectiveOrigin returns origin for http(s) frames', () => {
  assert.equal(effectiveOrigin(['http://localhost:5173/app?x=1']), 'http://localhost:5173');
  assert.equal(effectiveOrigin(['https://example.com/a#b']), 'https://example.com');
});

test('effectiveOrigin inherits through about:blank and about:srcdoc', () => {
  assert.equal(effectiveOrigin(['about:srcdoc', 'http://localhost:3000/']), 'http://localhost:3000');
  assert.equal(effectiveOrigin(['about:blank', 'about:srcdoc', 'https://app.test/']), 'https://app.test');
});

test('effectiveOrigin fails closed for opaque or invalid origins', () => {
  assert.equal(effectiveOrigin(['file:///etc/hosts']), null);
  assert.equal(effectiveOrigin(['data:text/html,hi']), null);
  assert.equal(effectiveOrigin(['not a url']), null);
  assert.equal(effectiveOrigin([]), null);
  assert.equal(effectiveOrigin(['about:blank']), null);
});

test('same-origin child frame is inlined', () => {
  assert.equal(shouldInlineFrame(['http://localhost:5173/frame'], ['http://localhost:5173/'], false), true);
});

test('cross-origin child frame (different port) is not inlined by default', () => {
  assert.equal(shouldInlineFrame(['http://127.0.0.1:60910/frame'], ['http://127.0.0.1:60911/'], false), false);
});

test('cross-origin child frame (different host / scheme) is not inlined by default', () => {
  assert.equal(shouldInlineFrame(['https://widget.example/'], ['https://app.example/'], false), false);
  assert.equal(shouldInlineFrame(['http://app.example/'], ['https://app.example/'], false), false);
});

test('nested: same-origin grandchild inside a cross-origin frame is judged against its direct parent', () => {
  const parent = ['https://widget.example/', 'https://app.example/'];
  assert.equal(shouldInlineFrame(['https://app.example/secret', ...parent], parent, false), false);
});

test('srcdoc child inherits its parent origin and is inlined', () => {
  const parent = ['https://app.example/'];
  assert.equal(shouldInlineFrame(['about:srcdoc', ...parent], parent, false), true);
});

test('opaque-origin child is not inlined by default', () => {
  assert.equal(shouldInlineFrame(['data:text/html,x'], ['https://app.example/'], false), false);
});

test('--allow-cross-origin-frames opt-in restores cross-origin inlining', () => {
  assert.equal(shouldInlineFrame(['https://widget.example/'], ['https://app.example/'], true), true);
});

test('snapshot.ts gates the Puppeteer frame merge on shouldInlineFrame', () => {
  assert.match(snapshotSource, /from '\.\/frame_policy\.ts'/);
  assert.match(snapshotSource, /shouldInlineFrame\(frameChain\(frame\), frameChain\(frame\.parentFrame\(\)\), opts\.allowCrossOriginFrames\)/);
  const gate = snapshotSource.indexOf('shouldInlineFrame(frameChain(frame)');
  const merge = snapshotSource.indexOf('const frameBodyHtml = await frame.evaluate');
  assert.ok(gate > 0 && merge > gate, 'origin check must run before frame content is read');
});

test('snapshot.ts exposes --allow-cross-origin-frames and defaults it off', () => {
  assert.match(snapshotSource, /case '--allow-cross-origin-frames':/);
  assert.match(snapshotSource, /allowCrossOriginFrames: false,/);
});
