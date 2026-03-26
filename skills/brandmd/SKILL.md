---
name: brandmd
description: Extract a live website's design system into a DESIGN.md file for use with Stitch. Complements the design-md skill by importing brands from existing sites.
allowed-tools:
  - "stitch*:*"
  - "Bash"
  - "Read"
  - "Write"
---

# brandmd: Website to DESIGN.md

You extract a live website's design system into a DESIGN.md file that Stitch can use to generate on-brand UI.

This skill complements the `design-md` skill. While `design-md` documents design systems from existing Stitch projects, `brandmd` imports design systems from live websites into the Stitch workflow.

## When to use

- User wants to generate Stitch screens matching an existing website's brand
- User says "use the same design as [url]" or "match this website"
- Starting a new Stitch project for a client who has an existing site
- User needs a DESIGN.md but doesn't have a Stitch project yet

## Prerequisites

Node.js 18+ must be available. The tool installs automatically via npx on first run.

## Extraction

Run brandmd to extract the design system from the target URL:

```bash
npx brandmd <url> -o DESIGN.md
```

Pass the most design-rich page for best results. The homepage is usually the best choice. The tool renders the page in a headless browser, scrolls through lazy-loaded content, dismisses cookie banners, and extracts computed styles from every visible element.

### What it extracts

- **Colors** clustered by similarity with semantic roles (background, text, accent, border)
- **Typography** with font families, size scale grouped by heading/body/caption, and weights
- **Spacing scale** with base grid unit detection
- **Border radii** and shadow styles
- **Component patterns** for buttons, cards, and inputs

### Output format

The output follows the DESIGN.md 5-section format:

1. Visual Theme & Atmosphere
2. Color Palette & Roles
3. Typography Rules
4. Component Stylings
5. Layout Principles

## Integration with Stitch

After extraction:

1. Read the generated DESIGN.md
2. Review the extracted tokens with the user (colors, fonts, spacing)
3. Use the DESIGN.md as context for Stitch screen generation via the `stitch-design` or `enhance-prompt` skills
4. When calling `[prefix]:generate`, reference specific tokens from DESIGN.md in the prompt (e.g. "use the primary font sohne-var, accent color #533AFD, 4px spacing grid")

## Options

- `npx brandmd <url>` — output to stdout
- `npx brandmd <url> -o DESIGN.md` — save to file
- `npx brandmd <url> --json` — raw tokens as JSON for programmatic use

## Limitations

- Extracts from a single page, not the entire site
- Cannot read Figma tokens or design tool files
- Color role assignment is heuristic based on usage frequency and luminance
- Requires a publicly accessible URL (no auth-gated pages)
- The extracted DESIGN.md is a starting point. Review and adjust color roles and component styles before using in production.
