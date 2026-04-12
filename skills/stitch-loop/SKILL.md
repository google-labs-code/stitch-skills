---
name: stitch-loop
description: Guides agents through a full Stitch design-to-code delivery loop: set up Stitch MCP access, generate or edit designs, integrate them into a frontend codebase, run browser QA, review findings, fix issues, and continue with the next iteration.
allowed-tools:
  - "stitch*:*"
  - "chrome*:*"
  - "Read"
  - "Write"
  - "Bash"
---

# Stitch Full-Stack Delivery Loop

Use this skill when Stitch is part of a real frontend delivery workflow, not just a one-off mockup. The goal is to move from prompt to production-ready UI through a repeatable loop:

1. Plan the slice
2. Generate or edit the design in Stitch
3. Pull the design artifacts into the repo
4. Convert the design into maintainable app code
5. Run browser QA
6. Fix issues and retest
7. Write the next baton for the next iteration

## Read these resources when needed

- `resources/fullstack-playbook.md` for the overall operating model and exit criteria
- `resources/stitch-mcp-setup.md` when Stitch MCP access is not ready yet
- `resources/openclaw-browser-qa.md` when running inside OpenClaw or when browser QA should be delegated to OpenClaw browser tooling
- `resources/baton-schema.md` for the baton contract
- `resources/site-template.md` when bootstrapping `.stitch/SITE.md` and `.stitch/DESIGN.md`

## Default posture

- Treat Stitch as a design accelerator, not the owner of your frontend architecture
- Keep routes, state, API contracts, validation, and tests in the application repo
- Prefer `edit_screens` or targeted follow-up generations over full regeneration when refining an existing screen
- Do not call a slice done until browser QA has passed
- Keep the loop alive by updating `.stitch/next-prompt.md` before you finish

## Minimum project context

Before starting, make sure these files exist or create them:

```text
.stitch/
├── metadata.json
├── DESIGN.md
├── SITE.md
└── next-prompt.md
```

Helpful adjacent files outside `.stitch/`:

```text
docs/
├── api-contracts.md
├── acceptance-criteria.md
└── frontend-architecture.md
```

If these docs do not exist, infer the minimum viable structure from the repo and write down any assumptions you make.

## Phase 0: Confirm Stitch access

1. Run `list_tools` and look for a Stitch namespace such as `stitch:` or `mcp_stitch:`
2. If Stitch tools are missing, read `resources/stitch-mcp-setup.md` and get the MCP path working first
3. If the repo already stores `.stitch/metadata.json`, reuse the saved `projectId` and screen metadata instead of creating a new project

## Phase 1: Read the baton and project context

Parse `.stitch/next-prompt.md` to extract:
- the page or feature name from frontmatter
- the prompt body
- any design system block copied from `.stitch/DESIGN.md`

Then read:
- `.stitch/SITE.md` for roadmap, sitemap, and project intent
- `.stitch/DESIGN.md` for visual rules
- the app's routing, component, and API structure in the repo
- any acceptance criteria or API contracts that constrain the slice

## Phase 2: Generate or edit in Stitch

Use the Stitch MCP tools to generate or update the screen.

### Project and metadata flow

1. Discover the Stitch namespace via `list_tools`
2. If `.stitch/metadata.json` exists, reuse `projectId`
3. Otherwise:
   - call `[prefix]:create_project`
   - call `[prefix]:get_project`
   - save the returned project metadata to `.stitch/metadata.json`
4. After each generation or edit, call `[prefix]:get_project` again and refresh the stored `screens` map with each screen's metadata

### Screen generation flow

Use one of these patterns:
- `generate_screen_from_text` for new screens
- `edit_screens` for targeted refinements to an existing screen
- `generate_variants` when explicitly comparing directions

Always keep the prompt grounded in the current design system and product constraints.

### Artifact sync

Before downloading, check whether these files already exist:

```text
.stitch/designs/{page}.html
.stitch/designs/{page}.png
```

- If they already exist, ask whether to refresh them from Stitch or reuse them
- If they do not exist, download them and persist them locally
- When downloading screenshots, append `=w{width}` to the screenshot URL so the local image matches the actual screen width instead of a thumbnail

## Phase 3: Productionize the design in code

Do not stop at copied HTML.

### Required productionization work

- map the screen into the app's actual routes or pages
- extract reusable components instead of shipping a single giant generated file
- move static content into data files when appropriate
- connect forms, state, and API calls to the app's real architecture
- add loading, empty, error, and permission states
- preserve or translate the design tokens into the target design system
- keep navigation, header, footer, and layout shells consistent with the rest of the app

### Handoff guidance

- Use `stitch-design` when the prompt or design system still needs work
- Use `react:components` when the screen needs to become modular React code
- If the project is Next.js, Astro, Vite, or another existing stack, integrate into that stack instead of creating parallel demo output

## Phase 4: Browser QA is mandatory

After integration, run the feature in a real browser.

### Preferred browser QA path

If you are running inside OpenClaw, read `resources/openclaw-browser-qa.md` and prefer the OpenClaw path:
- use `remote-opencli` when the browser-backed run should happen through the remote OpenCLI stack
- use `agent-browser` when deterministic click, snapshot, and interaction steps are needed

### Generic fallback

If OpenClaw browser tooling is not available, use Chrome DevTools MCP or the best available browser automation surface.

### Minimum QA checklist

- open the actual route and verify it renders
- compare the integrated page against the Stitch screenshot for layout fidelity
- test navigation links and route transitions
- test forms and input validation
- verify responsive behavior at the key widths the app supports
- inspect obvious empty, error, and loading states
- check browser console errors and failed network requests
- capture issues in a short QA note before fixing them

## Phase 5: Review, fix, and retest

Treat QA as a loop, not a single pass.

1. Convert findings into concrete fixes
2. Patch the frontend code, not the symptom screenshot
3. Re-run browser QA after each meaningful fix set
4. Repeat until the slice passes visual, behavioral, and integration checks

If the issue is really a design issue rather than an implementation issue, loop back to Stitch and edit the source screen, then pull the updated design back into code.

## Phase 6: Update the project record

Update the repo state before you finish:

- refresh `.stitch/metadata.json`
- update `.stitch/SITE.md` sitemap and roadmap
- note any important implementation constraints or API assumptions in the repo docs
- update `.stitch/next-prompt.md` with the next baton

## Baton rules

The baton file keeps the loop alive.

```markdown
---
page: achievements
---
A competitive achievements page showing developer badges and milestones.

**DESIGN SYSTEM (REQUIRED):**
[Copy the relevant block from .stitch/DESIGN.md]

**Page Structure:**
1. Header with title and navigation
2. Badge grid showing locked and unlocked states
3. Progress bars for milestone tracking
```

Critical rules:
- `page` controls the output filename
- the body must include the design system block
- the next baton must describe a page or slice that is not already complete in the sitemap

## Definition of done

A loop iteration is only done when all of these are true:

- Stitch design state is saved and locally synced
- the feature is integrated into the real app structure
- navigation and data wiring are in place
- browser QA has been run on the integrated result
- discovered issues were fixed or clearly documented
- `.stitch/SITE.md`, `.stitch/metadata.json`, and `.stitch/next-prompt.md` are up to date

## Common failure modes

- stopping at exported HTML and calling it implementation
- regenerating whole screens when a small edit would do
- ignoring loading, empty, or error states
- skipping browser QA and relying only on code inspection
- forgetting to refresh `.stitch/metadata.json`
- forgetting to update the baton and breaking the loop
