import assert from 'node:assert/strict';
import test from 'node:test';
import {
  decodeHtmlAttribute,
  escapeHtmlAttribute,
  escapeHtmlText,
  escapeRawText,
  formatStyleValue,
} from '../scripts/html_serialize.ts';

test('preserves raw-text CSS and JavaScript without HTML escaping', () => {
  for (const tag of ['style', 'script']) {
    for (const value of ['', '.card > p { content: "a & b" }', 'if (a < b) x = "&amp;";']) {
      assert.equal(escapeRawText(tag, value), value);
    }
  }
});

test('escapes raw-text tag sequences like React DOM', () => {
  assert.equal(escapeRawText('style', '</style><STYLE><sTyLe>'), '</\\73 tyle><\\53 TYLE><\\73 TyLe>');
  assert.equal(escapeRawText('script', '</script><SCRIPT><sCrIpT>'), '</\\u0073cript><\\u0053CRIPT><\\u0073CrIpT>');
});

test('decodes serialized attributes exactly once for URL consumers', () => {
  for (const value of ['', 'https://example.com/image?w=800&q=80', '&amp;', '&quot;&lt;&gt;', '"<&>\'', '&#38;', '&unknown;']) {
    assert.equal(decodeHtmlAttribute(escapeHtmlAttribute(value)), value);
  }
  assert.equal(decodeHtmlAttribute('&amp;amp;'), '&amp;');
});

test('escapes text including decoded JSX entities without escaping quotes', () => {
  assert.equal(escapeHtmlText('<tag> & "quoted" \'text\''), '&lt;tag&gt; &amp; "quoted" \'text\'');
  assert.equal(escapeHtmlText('&lt;'), '&amp;lt;');
});

test('escapes double-quoted attributes without escaping apostrophes', () => {
  assert.equal(escapeHtmlAttribute('"<&>\''), '&quot;&lt;&amp;&gt;\'');
  assert.equal(escapeHtmlAttribute('content: "<hello>&"'), 'content: &quot;&lt;hello&gt;&amp;&quot;');
});

test('preserves plain and empty text and attribute values', () => {
  for (const value of ['', 'Dashboard', '1.5', 'hello world']) {
    assert.equal(escapeHtmlText(value), value);
    assert.equal(escapeHtmlAttribute(value), value);
  }
});

test('keeps React unitless numeric styles and custom properties unitless', () => {
  for (const name of [
    'opacity', 'zIndex', 'flex', 'flexGrow', 'flexShrink', 'fontWeight',
    'lineHeight', 'order', 'zoom', 'gridArea', 'gridRow', 'gridRowStart',
    'gridRowEnd', 'gridRowSpan', 'gridColumn', 'gridColumnStart',
    'gridColumnEnd', 'gridColumnSpan', 'scale', 'strokeWidth',
    'WebkitFlexGrow', 'msGridRow', 'MozBoxFlex', '--x',
  ]) {
    assert.equal(formatStyleValue(name, 1.5), '1.5', name);
  }
});

test('adds px to dimensional numbers but not zero or string values', () => {
  assert.equal(formatStyleValue('width', 12), '12px');
  assert.equal(formatStyleValue('marginTop', -2), '-2px');
  assert.equal(formatStyleValue('height', 0), '0');
  assert.equal(formatStyleValue('height', -0), '0');
  assert.equal(formatStyleValue('width', '50%'), '50%');
  assert.equal(formatStyleValue('width', ''), '');
});
