---
name: react:components
description: Converts Stitch designs into modular Vite and React components using system-level networking and AST-based validation. Use when the user wants to "implement this Stitch screen in React", "convert a Stitch design to TypeScript components", "scaffold modular React components from a Stitch HTML export", or "wire a Stitch design into an existing Vite + React project". Do NOT use for non-React frameworks (Vue, Svelte, native iOS/Android), backend code, or design generation in Stitch itself.
allowed-tools:
  - "stitch*:*"
  - "Bash"
  - "Read"
  - "Write"
  - "web_fetch"
---

# Stitch to React Components

You are a frontend engineer focused on transforming designs into clean React code. You follow a modular approach and use automated tools to ensure code quality.

## Retrieval and networking
1. **Namespace discovery**: Run `list_tools` to find the Stitch MCP prefix. Use this prefix (e.g., `stitch:`) for all subsequent calls.
2. **Metadata fetch**: Call `[prefix]:get_screen` to retrieve the design JSON.
3. **Check for existing designs**: Before downloading, check if `.stitch/designs/{page}.html` and `.stitch/designs/{page}.png` already exist:
   - **If files exist**: Ask the user whether to refresh the designs from the Stitch project using the MCP, or reuse the existing local files. Only re-download if the user confirms.
   - **If files do not exist**: Proceed to step 4.
4. **High-reliability download**: Internal AI fetch tools can fail on Google Cloud Storage domains.
   - **HTML**: `bash scripts/fetch-stitch.sh "[htmlCode.downloadUrl]" ".stitch/designs/{page}.html"`
    - **Screenshot**: Append `=w{width}` to the screenshot URL first, where `{width}` is the `width` value from the screen metadata (Google CDN serves low-res thumbnails by default). Then run: `bash scripts/fetch-stitch.sh "[screenshot.downloadUrl]=w{width}" ".stitch/designs/{page}.png"`
   - This script handles the necessary redirects and security handshakes.
5. **Visual audit**: Review the downloaded screenshot (`.stitch/designs/{page}.png`) to confirm design intent and layout details.

## Architectural rules
* **Modular components**: Break the design into independent files. Avoid large, single-file outputs.
* **Logic isolation**: Move event handlers and business logic into custom hooks in `src/hooks/`.
* **Data decoupling**: Move all static text, image URLs, and lists into `src/data/mockData.ts`.
* **Type safety**: Every component must include a `Readonly` TypeScript interface named `[ComponentName]Props`.
* **Project specific**: Focus on the target project's needs and constraints. Leave Google license headers out of the generated React components.
* **Style mapping**:
    * Extract the `tailwind.config` from the HTML `<head>`.
    * Sync these values with `resources/style-guide.json`.
    * Use theme-mapped Tailwind classes instead of arbitrary hex codes.

## Execution steps
1. **Environment setup**: If `node_modules` is missing, run `npm install` to enable the validation tools.
2. **Data layer**: Create `src/data/mockData.ts` based on the design content.
3. **Component drafting**: Use `resources/component-template.tsx` as a base. Find and replace all instances of `StitchComponent` with the actual name of the component you are creating.
4. **Application wiring**: Update the project entry point (like `App.tsx`) to render the new components.
5. **Quality check**:
    * Run `npm run validate <file_path>` for each component.
    * Verify the final output against the `resources/architecture-checklist.md`.
    * Start the dev server with `npm run dev` to verify the live result.

## Examples

### Example 1: Convert a single Stitch screen to a feature module

The user has a Stitch landing page screen and wants it as React components in their Vite project:

1. Run the namespace + metadata steps to fetch the screen JSON
2. Download HTML and screenshot to `.stitch/designs/landing.html` and `.stitch/designs/landing.png`
3. Identify three top-level sections in the screenshot (hero, feature grid, footer)
4. Extract static text and image URLs into `src/data/mockData.ts` as `LandingHeroData`, `LandingFeaturesData`, `LandingFooterData`
5. Draft `Hero.tsx`, `FeatureGrid.tsx`, `Footer.tsx` using the template, each with a `Readonly<...Props>` interface
6. Wire them into `App.tsx` and run `npm run validate` on each file
7. Refer to `examples/gold-standard-card.tsx` for the modular pattern

### Example 2: Reuse local files instead of re-downloading

The user has previously generated `.stitch/designs/checkout.html` and `.stitch/designs/checkout.png` and wants to retry the React conversion without hitting the Stitch MCP again:

1. Detect that both files exist; ask the user "Refresh from Stitch or reuse local files?"
2. On "reuse", skip steps 2-4 of the retrieval section and start at the visual audit
3. Continue with data extraction, component drafting, and validation as in example 1

### Example 3: Migrate hardcoded hex codes to theme classes

The Stitch HTML uses inline `bg-[#1a365d]` styles. The Tailwind config in the HTML head defines `theme.extend.colors.brand.deep = "#1a365d"`:

1. Read the `tailwind.config` block from the HTML head
2. Update `resources/style-guide.json` with the new mapping
3. In every drafted component, replace `bg-[#1a365d]` with `bg-brand-deep`
4. Run `npm run validate` to confirm no arbitrary hex codes remain

## Error Handling

| Symptom | Likely cause | What to do |
|---------|--------------|-----------|
| `list_tools` returns no Stitch entries | Stitch MCP server not connected | Confirm connection with the user; do not invent a prefix |
| `fetch-stitch.sh` fails with 403 or 401 | Google CDN security handshake not followed | Retry once; if it still fails, ask the user to verify their Stitch session is active |
| Screenshot is a low-res thumbnail | The `=w{width}` suffix was missing on the screenshot URL | Append `=w{width}` using the `width` from screen metadata before re-running |
| `.stitch/designs/{page}.html` already exists | Previous run downloaded the file | Ask the user: refresh from Stitch, or reuse local files? Only re-download on confirmation |
| `npm run validate` reports missing `Readonly<...Props>` | The component drafting step skipped the type interface | Add a `Readonly<ComponentNameProps>` interface and re-run validate |
| `npm run validate` reports hardcoded hex codes | The Tailwind theme mapping step was skipped | Sync the HTML's `tailwind.config` into `resources/style-guide.json` and replace arbitrary hex classes |
| `npm install` fails on a fresh project | Node modules missing required peer dependencies | Run `npm install` from the project root, not from `.stitch/`; verify the React/Vite setup matches the project README |
| Components render blank in `npm run dev` | Asset paths point to `.stitch/designs/` instead of project public dir | Move images to `public/` (or wire through Vite's `import.meta.url`) before referencing them in components |
| Single huge component file produced | Modular split step was skipped | Re-read `architectural rules` and break the design into one file per logical region (header, content, footer) |

If a Stitch tool returns an unexpected schema, capture the full response and ask the user before guessing field names. Never silently fall back to default placeholder values for missing design tokens.