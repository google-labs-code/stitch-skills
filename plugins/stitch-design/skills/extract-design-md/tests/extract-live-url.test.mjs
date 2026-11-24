import assert from 'node:assert/strict';
import test from 'node:test';
import {
  assembleResult,
  colorSchemeForBackground,
  filterCustomProperties,
  isSandboxLaunchError,
  launchBrowser,
  normalizeColor,
  parseArgs,
  pickCard,
  pickPrimaryButton,
  validateUrl,
} from '../scripts/extract-live-url.mjs';

test('parseArgs reads --url and --screenshot and defaults the screenshot path', () => {
  assert.deepEqual(parseArgs(['--url', 'https://example.com']), {
    url: 'https://example.com',
    screenshot: '.stitch/live-url-screenshot.png',
  });
  assert.deepEqual(
    parseArgs(['--url', 'https://example.com', '--screenshot', 'shots/home.png']),
    { url: 'https://example.com', screenshot: 'shots/home.png' },
  );
  assert.throws(() => parseArgs(['--screenshot', 'x.png']), /--url is required/);
  assert.throws(() => parseArgs(['--url', 'https://example.com', '--bogus']), /Unknown argument/);
});

test('validateUrl accepts http and https only', () => {
  assert.equal(validateUrl('https://example.com/page').protocol, 'https:');
  assert.equal(validateUrl('http://localhost:5173').protocol, 'http:');
  for (const bad of ['file:///etc/passwd', 'javascript:alert(1)', 'data:text/html,hi', 'ftp://x', 'not a url']) {
    assert.throws(() => validateUrl(bad), /URL/, bad);
  }
});

test('normalizeColor converts rgb and rgba to hex and drops transparent', () => {
  assert.equal(normalizeColor('rgb(83, 58, 253)'), '#533afd');
  assert.equal(normalizeColor('rgba(83, 58, 253, 1)'), '#533afd');
  assert.equal(normalizeColor('rgba(0, 0, 0, 0)'), null);
  assert.equal(normalizeColor('transparent'), null);
  assert.equal(normalizeColor('#abc'), '#aabbcc');
  assert.equal(normalizeColor('#AABBCC'), '#aabbcc');
  assert.equal(normalizeColor('rgb(100%, 0%, 0%)'), '#ff0000');
});

test('normalizeColor converts modern oklch, oklab and color() values to hex', () => {
  assert.equal(normalizeColor('oklch(0% 0 0)'), '#000000');
  assert.equal(normalizeColor('oklch(100% 0 0)'), '#ffffff');
  assert.equal(normalizeColor('oklab(0 0 0)'), '#000000');
  assert.equal(normalizeColor('color(srgb 1 0 0)'), '#ff0000');
  assert.equal(normalizeColor('color(srgb 0.5 0.5 0.5)'), '#808080');
  const red = normalizeColor('oklch(0.637 0.237 25.331)');
  assert.match(red, /^#[0-9a-f]{6}$/);
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(red.slice(i, i + 2), 16));
  assert.ok(r > 200 && g < 110 && b < 110, `expected a red, got ${red}`);
  assert.equal(normalizeColor('oklch(50% 0.1 180 / 0)'), null);
});

test('normalizeColor scales oklch and oklab percentages like the CSS spec', () => {
  assert.equal(normalizeColor('oklab(50% 25% 0%)'), normalizeColor('oklab(0.5 0.1 0)'));
  assert.equal(normalizeColor('oklch(50% 100% 0)'), normalizeColor('oklch(0.5 0.4 0)'));
  assert.equal(normalizeColor('oklch(0.5 0.1 0.5turn)'), normalizeColor('oklch(0.5 0.1 180)'));
  assert.equal(normalizeColor('oklch(0.5 0.1 3.141592653589793rad)'), normalizeColor('oklch(0.5 0.1 180)'));
});

test('normalizeColor handles none components without emitting NaN', () => {
  assert.equal(normalizeColor('oklch(0.5 0 none)'), normalizeColor('oklch(0.5 0 0)'));
  assert.match(normalizeColor('oklch(0.5 0 none)'), /^#[0-9a-f]{6}$/);
  assert.equal(normalizeColor('oklch(none none none)'), '#000000');
});

test('normalizeColor converts display-p3 colors instead of dropping them', () => {
  assert.equal(normalizeColor('color(display-p3 0 0 0)'), '#000000');
  assert.equal(normalizeColor('color(display-p3 1 1 1)'), '#ffffff');
  const red = normalizeColor('color(display-p3 1 0 0)');
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(red.slice(i, i + 2), 16));
  assert.ok(r > 200 && g < 110 && b < 110, `expected a red, got ${red}`);
});

test('normalizeColor composites partial alpha over the backdrop', () => {
  assert.equal(normalizeColor('rgba(0, 0, 0, 0.01)'), '#fcfcfc');
  assert.equal(normalizeColor('rgba(255, 0, 0, 0.5)'), '#ff8080');
  assert.equal(normalizeColor('rgba(0, 0, 0, 0.5)', '#000000'), '#000000');
  assert.equal(colorSchemeForBackground(normalizeColor('rgba(0, 0, 0, 0.01)')), 'light');
});

test('launchBrowser only falls back to --no-sandbox for sandbox failures', async () => {
  const calls = [];
  const flaky = async (args) => {
    calls.push(args);
    if (calls.length === 1) throw new Error('Running as root without --no-sandbox is not supported');
    return 'browser';
  };
  assert.equal(await launchBrowser(flaky), 'browser');
  assert.deepEqual(calls[1], ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']);
  assert.ok(isSandboxLaunchError(new Error('Failed to move to new namespace: Operation not permitted')));
  assert.ok(!isSandboxLaunchError(new Error('Timed out after 30000 ms while trying to connect to the browser')));

  let attempts = 0;
  const broken = async () => {
    attempts++;
    throw new Error('Timed out after 30000 ms while trying to connect to the browser');
  };
  await assert.rejects(() => launchBrowser(broken), /Timed out/);
  assert.equal(attempts, 1);
});

test('assembleResult composites text over its actual background', () => {
  const text = {
    'font-family': 'Inter',
    'font-size': '16px',
    'font-weight': '400',
    'line-height': '24px',
    'letter-spacing': '0px',
    color: 'rgba(255, 255, 255, 0.5)',
  };
  const raw = {
    title: 'Dark page',
    bodyText: { ...text },
    backgroundCandidates: ['rgba(0, 0, 0, 0)', 'rgb(0, 0, 0)'],
    h1: { ...text },
    h2: null,
    link: { color: 'rgba(255, 255, 255, 0.5)' },
    buttons: [
      {
        'background-color': 'rgb(255, 0, 0)',
        color: 'rgba(255, 255, 255, 0.5)',
        'border-radius': '6px',
        padding: '12px',
        inMain: true,
        area: 9000,
      },
    ],
    cards: [],
    spacingSamples: ['8px'],
    customProps: {},
    logo: null,
    ogImage: null,
  };
  const result = assembleResult(raw);
  assert.equal(result.colorScheme, 'dark');
  assert.equal(result.body['background-color'], '#000000');
  assert.equal(result.body.color, '#808080');
  assert.equal(result.h1.color, '#808080');
  assert.equal(result.link.color, '#808080');
  assert.equal(result.button['background-color'], '#ff0000');
  assert.equal(result.button.color, '#ff8080');
});

test('colorSchemeForBackground infers scheme from background luminance', () => {
  assert.equal(colorSchemeForBackground('#08090a'), 'dark');
  assert.equal(colorSchemeForBackground('#000000'), 'dark');
  assert.equal(colorSchemeForBackground('#ffffff'), 'light');
  assert.equal(colorSchemeForBackground('#fcf8fa'), 'light');
});

test('filterCustomProperties drops --tw-* noise and empty values', () => {
  assert.deepEqual(
    filterCustomProperties({
      '--color-primary': 'rgb(83, 58, 253)',
      '--tw-ring-shadow': '0 0 #0000',
      '--tw-translate-x': '0',
      '--spacing-unit': '8px',
      '--empty': '  ',
    }),
    { '--color-primary': '#533afd', '--spacing-unit': '8px' },
  );
});

test('pickPrimaryButton skips transparent and neutral buttons for the main CTA', () => {
  const headerToggle = { 'background-color': null, color: '#111111', inMain: false, area: 1600 };
  const cookieButton = { 'background-color': '#e5e5e5', color: '#111111', inMain: false, area: 8000 };
  const cta = { 'background-color': '#533afd', color: '#ffffff', inMain: true, area: 9000 };
  assert.equal(pickPrimaryButton([headerToggle, cookieButton, cta]), cta);
  assert.equal(pickPrimaryButton([headerToggle]), null);
});

test('pickCard returns the first candidate with a real background', () => {
  const section = { 'background-color': null, 'border-radius': '0px' };
  const card = { 'background-color': '#f0edef', 'border-radius': '8px' };
  assert.equal(pickCard([section, card]), card);
  assert.equal(pickCard([section]), null);
});
