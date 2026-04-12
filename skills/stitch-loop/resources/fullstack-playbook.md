# Stitch Full-Stack Playbook

Use this playbook when Stitch is part of a real frontend build cycle.

## Inputs to gather before each slice

Minimum inputs:
- product or feature brief
- route or page name
- target device priorities
- acceptance criteria
- data or API dependencies
- current `.stitch/DESIGN.md`
- current `.stitch/SITE.md`

Helpful extras:
- `docs/api-contracts.md`
- `docs/frontend-architecture.md`
- design token files
- auth and permission rules

## Phase 1: Frame the slice

Before touching Stitch, answer these questions:
- What route or user flow is being built?
- What does success look like?
- What data does the page need?
- Which states must exist besides the happy path?
- Is this a brand new screen, a refinement, or a code-only fix?

## Phase 2: Generate or refine the design

Use Stitch to:
- generate a new screen from a structured prompt
- edit an existing screen with a precise follow-up prompt
- create variants only when a real decision is needed

Keep a stable design system. Do not change the visual language casually from slice to slice.

## Phase 3: Pull the design into the repo

Persist:
- `.stitch/metadata.json`
- `.stitch/designs/{page}.html`
- `.stitch/designs/{page}.png`

Keep the downloaded design artifacts as staging material, not the final architecture.

## Phase 4: Productionize

Expected productionization work:
- split generated markup into maintainable components
- align styles with the app's token system
- wire routing, forms, state, and data fetching
- add accessibility affordances and interaction states
- preserve reusable layout shells and navigation
- remove placeholder data when the app has real data sources

## Phase 5: Browser QA

A slice is not done until it has been exercised in a browser.

Check at minimum:
- visual fidelity against the Stitch screenshot
- route rendering and navigation
- responsive behavior
- console and network failures
- form behavior and validation
- loading, empty, and error states

If you are inside OpenClaw, prefer the OpenClaw browser workflow described in `openclaw-browser-qa.md`.

## Phase 6: Fix and retest

Use a tight loop:
1. capture findings
2. fix the underlying code issue
3. rerun browser QA
4. only loop back to Stitch if the problem is fundamentally a design issue

## Phase 7: Prepare the next iteration

Before ending the slice:
- update `.stitch/SITE.md`
- refresh `.stitch/metadata.json`
- write the next baton in `.stitch/next-prompt.md`
- note any architectural or API assumptions in repo docs

## Exit criteria

Do not mark the slice done unless all of these are true:
- design synced locally
- real app code updated
- browser QA performed
- major findings fixed or documented
- baton updated
