/**
 * Frame inlining policy for snapshot.ts.
 *
 * snapshot.ts uses Puppeteer to read the DOM of child frames and merge it into
 * the parent frame's DOM.  Puppeteer's frame.evaluate() is not subject to the
 * Same-Origin Policy, so merging a cross-origin child into its parent hands the
 * child's content to the parent origin's still-running JavaScript, which the
 * browser would otherwise forbid.
 *
 * By default only frames whose effective origin matches their parent's
 * effective origin are merged.  Cross-origin merging requires an explicit
 * opt-in (--allow-cross-origin-frames) and should only be used on trusted pages.
 */

/**
 * Compute the effective origin of a frame from its URL chain
 * (the frame's own URL first, followed by each ancestor's URL up to the top).
 *
 * about:blank / about:srcdoc frames inherit their origin from the nearest
 * ancestor with a real URL.  Returns null for opaque or unparseable origins
 * (file:, data:, blob: with an opaque origin, etc.) so that callers fail closed.
 */
export function effectiveOrigin(urlChain: string[]): string | null {
  for (const raw of urlChain) {
    if (!raw || raw === 'about:blank' || raw === 'about:srcdoc') continue;
    let parsed: URL;
    try {
      parsed = new URL(raw);
    } catch {
      return null;
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    return parsed.origin;
  }
  return null;
}

/**
 * Decide whether a child frame's content may be merged into its parent frame.
 */
export function shouldInlineFrame(
  childChain: string[],
  parentChain: string[],
  allowCrossOrigin: boolean,
): boolean {
  if (allowCrossOrigin) return true;
  const child = effectiveOrigin(childChain);
  const parent = effectiveOrigin(parentChain);
  return child !== null && child === parent;
}
