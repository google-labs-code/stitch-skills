#!/usr/bin/env node
/**
 * extract-live-url.mjs — Render a live page locally with headless Chrome and
 * print its computed styles as JSON, plus a screenshot saved to a local file.
 *
 * Usage:
 *   node extract-live-url.mjs --url <URL> [--screenshot <PATH>]
 *
 * The page is fetched directly by the local browser; no third-party
 * extraction service is involved and no API key is needed.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function parseArgs(argv) {
  const opts = { url: null, screenshot: '.stitch/live-url-screenshot.png' };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--url') opts.url = argv[++i] ?? null;
    else if (argv[i] === '--screenshot') opts.screenshot = argv[++i] ?? null;
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  if (!opts.url) throw new Error('--url is required');
  if (!opts.screenshot) throw new Error('--screenshot requires a path');
  return opts;
}

export function validateUrl(raw) {
  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(`Invalid URL: "${raw}"`);
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`Refusing non-http(s) URL: "${raw}"`);
  }
  return parsed;
}

const clamp255 = (v) => Math.min(255, Math.max(0, Math.round(v)));

function channelsToHex(r, g, b) {
  return `#${[r, g, b].map((c) => clamp255(c).toString(16).padStart(2, '0')).join('')}`;
}

function linearToHex(r, g, b) {
  const enc = (c) => {
    const clamped = Math.min(1, Math.max(0, c));
    const s = clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055;
    return s * 255;
  };
  return channelsToHex(enc(r), enc(g), enc(b));
}

function oklabToHex(L, a, b) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  return linearToHex(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  );
}

function displayP3ToHex(r, g, b) {
  const lin = (c) => {
    const clamped = Math.min(1, Math.max(0, c));
    return clamped <= 0.04045 ? clamped / 12.92 : ((clamped + 0.055) / 1.055) ** 2.4;
  };
  const [R, G, B] = [r, g, b].map(lin);
  return linearToHex(
    1.2249401765 * R - 0.2249401765 * G,
    -0.0420568565 * R + 1.0420568565 * G,
    -0.0196375546 * R - 0.0786360456 * G + 1.0982736001 * B,
  );
}

const num = (token, percentScale = null) => {
  const t = token.trim().toLowerCase();
  if (t === 'none') return 0;
  if (percentScale !== null && t.endsWith('%')) return (parseFloat(t) / 100) * percentScale;
  return parseFloat(t);
};

function parseHue(token) {
  const t = token.trim().toLowerCase();
  if (t === 'none') return 0;
  if (t.endsWith('turn')) return parseFloat(t) * 360;
  if (t.endsWith('grad')) return parseFloat(t) * 0.9;
  if (t.endsWith('rad')) return (parseFloat(t) * 180) / Math.PI;
  return parseFloat(t);
}

function parseColor(value) {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  if (v === 'transparent') return null;

  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
  if (hex) {
    const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join('') : hex[1];
    return { hex: `#${h}`, alpha: 1 };
  }

  const fn = v.match(/^(rgba?|oklch|oklab|color)\(([^)]*)\)$/);
  if (!fn) return null;
  const kind = fn[1];

  if (kind === 'color') {
    const inner = fn[2].trim();
    const space = inner.startsWith('display-p3') ? 'display-p3' : inner.startsWith('srgb') ? 'srgb' : null;
    if (!space) return null;
    const [mainPart, alphaPart] = inner.slice(space.length).split('/');
    const comps = mainPart.split(/\s+/).filter(Boolean).map((p) => num(p, 1));
    const alpha = alphaPart !== undefined ? num(alphaPart, 1) : 1;
    if (comps.length < 3 || !comps.every(Number.isFinite) || !Number.isFinite(alpha) || alpha <= 0) {
      return null;
    }
    const hexOut =
      space === 'srgb' ? channelsToHex(...comps.slice(0, 3).map((c) => c * 255)) : displayP3ToHex(...comps.slice(0, 3));
    return { hex: hexOut, alpha };
  }

  const parts = fn[2].split(/[\s,/]+/).filter(Boolean);
  const alpha = parts.length > 3 ? num(parts[3], 1) : 1;
  if (!Number.isFinite(alpha) || alpha <= 0) return null;

  if (kind === 'rgb' || kind === 'rgba') {
    if (parts.length < 3) return null;
    const ch = parts.slice(0, 3).map((p) => num(p, 255));
    if (!ch.every(Number.isFinite)) return null;
    return { hex: channelsToHex(...ch), alpha };
  }

  if (kind === 'oklch' || kind === 'oklab') {
    if (parts.length < 3) return null;
    const L = num(parts[0], 1);
    let hexOut;
    if (kind === 'oklch') {
      const C = num(parts[1], 0.4);
      const H = parseHue(parts[2]);
      if (![L, C, H].every(Number.isFinite)) return null;
      const rad = (H * Math.PI) / 180;
      hexOut = oklabToHex(L, C * Math.cos(rad), C * Math.sin(rad));
    } else {
      const a = num(parts[1], 0.4);
      const b = num(parts[2], 0.4);
      if (![L, a, b].every(Number.isFinite)) return null;
      hexOut = oklabToHex(L, a, b);
    }
    if (hexOut.includes('NaN')) return null;
    return { hex: hexOut, alpha };
  }

  return null;
}

export function normalizeColor(value, backdrop = '#ffffff') {
  const parsed = parseColor(value);
  if (!parsed) return null;
  if (parsed.alpha >= 1) return parsed.hex;
  const fg = [1, 3, 5].map((i) => parseInt(parsed.hex.slice(i, i + 2), 16));
  const bg = [1, 3, 5].map((i) => parseInt(backdrop.slice(i, i + 2), 16));
  const mixed = fg.map((c, i) => c * parsed.alpha + bg[i] * (1 - parsed.alpha));
  return channelsToHex(...mixed);
}

export function luminanceOf(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

export function colorSchemeForBackground(hex) {
  return luminanceOf(hex) < 0.5 ? 'dark' : 'light';
}

export function filterCustomProperties(props) {
  const out = {};
  for (const [name, value] of Object.entries(props)) {
    if (name.startsWith('--tw-')) continue;
    if (!value || !value.trim()) continue;
    out[name] = normalizeColor(value) ?? value.trim();
  }
  return out;
}

const isNeutral = (hex) => {
  const ch = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return Math.max(...ch) - Math.min(...ch) < 24;
};

export function pickPrimaryButton(candidates) {
  const usable = candidates.filter((c) => c['background-color']);
  if (usable.length === 0) return null;
  const score = (c) =>
    (c.inMain ? 4 : 0) + (isNeutral(c['background-color']) ? 0 : 2) + Math.min(c.area / 10000, 1);
  return [...usable].sort((a, b) => score(b) - score(a))[0];
}

export function pickCard(candidates) {
  return candidates.find((c) => c['background-color']) ?? null;
}

export function isSandboxLaunchError(err) {
  return /no-sandbox|sandbox|zygote|namespace|running as root/i.test(err?.message ?? '');
}

export async function launchBrowser(launch) {
  try {
    return await launch(['--disable-dev-shm-usage']);
  } catch (err) {
    if (!isSandboxLaunchError(err)) throw err;
    return launch(['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']);
  }
}

function extractInPage() {
  const pick = (el, props) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    return Object.fromEntries(props.map((p) => [p, cs.getPropertyValue(p)]));
  };
  const visible = (el) => {
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return false;
    for (let node = el; node; node = node.parentElement) {
      const cs = getComputedStyle(node);
      if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) {
        return false;
      }
    }
    return true;
  };
  const textProps = ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'color'];
  const customProps = {};
  for (const el of [document.documentElement, document.body]) {
    if (!el) continue;
    const cs = getComputedStyle(el);
    for (let i = 0; i < cs.length; i++) {
      const name = cs[i];
      if (name.startsWith('--')) customProps[name] = cs.getPropertyValue(name).trim();
    }
  }
  const buttons = [...document.querySelectorAll('button, [role="button"], input[type="submit"]')]
    .filter(visible)
    .slice(0, 50)
    .map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        ...pick(el, ['background-color', 'color', 'border-radius', 'padding']),
        inMain: Boolean(el.closest('main')),
        area: Math.round(rect.width * rect.height),
      };
    });
  const cards = [...document.querySelectorAll('[class*="card"], article, section')]
    .filter(visible)
    .slice(0, 50)
    .map((el) => pick(el, ['background-color', 'border-radius', 'padding']));
  return {
    title: document.title,
    bodyText: pick(document.body, textProps),
    backgroundCandidates: [
      pick(document.body, ['background-color'])?.['background-color'],
      pick(document.documentElement, ['background-color'])?.['background-color'],
    ],
    h1: pick(document.querySelector('h1'), textProps),
    h2: pick(document.querySelector('h2'), textProps),
    link: pick(document.querySelector('a'), ['color']),
    buttons,
    cards,
    spacingSamples: [...document.querySelectorAll('body *')]
      .slice(0, 200)
      .flatMap((el) => {
        const cs = getComputedStyle(el);
        return [cs.marginTop, cs.marginBottom, cs.paddingTop, cs.paddingBottom];
      })
      .filter((v) => v && v !== '0px'),
    customProps,
    logo: document.querySelector('link[rel~="icon"]')?.href ?? null,
    ogImage: document.querySelector('meta[property="og:image"]')?.content ?? null,
  };
}

function normalizePicked(obj, colorProps, backdrop) {
  if (!obj) return null;
  const out = { ...obj };
  for (const p of colorProps) {
    if (p in out) out[p] = normalizeColor(out[p], backdrop);
  }
  return out;
}

export function assembleResult(raw) {
  let background = '#ffffff';
  for (const candidate of [...raw.backgroundCandidates].reverse()) {
    background = normalizeColor(candidate, background) ?? background;
  }
  const button = pickPrimaryButton(
    raw.buttons.map((b) => {
      const picked = normalizePicked(b, ['background-color'], background);
      picked.color = normalizeColor(b.color, picked['background-color'] ?? background);
      return picked;
    }),
  );
  const card = pickCard(raw.cards.map((c) => normalizePicked(c, ['background-color'], background)));
  if (button) {
    delete button.inMain;
    delete button.area;
  }
  return {
    title: raw.title,
    colorScheme: colorSchemeForBackground(background),
    body: { ...normalizePicked(raw.bodyText, ['color'], background), 'background-color': background },
    h1: normalizePicked(raw.h1, ['color'], background),
    h2: normalizePicked(raw.h2, ['color'], background),
    link: normalizePicked(raw.link, ['color'], background),
    button,
    card,
    spacingSamples: raw.spacingSamples,
    customProps: filterCustomProperties(raw.customProps),
    logo: raw.logo,
    ogImage: raw.ogImage,
  };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const url = validateUrl(opts.url);

  let puppeteer;
  try {
    puppeteer = (await import('puppeteer')).default;
  } catch {
    throw new Error("Cannot find package 'puppeteer'. Install it in a temporary directory and run this script from there.");
  }

  const browser = await launchBrowser((args) => puppeteer.launch({ headless: true, args }));
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    try {
      await page.goto(url.href, { waitUntil: 'networkidle2', timeout: 15000 });
    } catch {
      await page.goto(url.href, { waitUntil: 'domcontentloaded', timeout: 15000 });
    }
    await new Promise((r) => setTimeout(r, 1000));
    await page.evaluate(() => document.fonts.ready);

    const screenshotPath = path.resolve(opts.screenshot);
    fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
    await page.screenshot({ path: screenshotPath });

    const raw = await page.evaluate(extractInPage);
    console.log(JSON.stringify(assembleResult(raw), null, 2));
  } finally {
    await browser.close();
  }
}

const invokedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (invokedDirectly) {
  main().catch((err) => {
    console.error(`extract-live-url: ${err.message}`);
    process.exit(1);
  });
}
