# OpenClaw Browser QA Guide

Use this guide when the Stitch loop runs inside OpenClaw and browser QA should be part of the implementation loop.

## Preferred OpenClaw path

Use OpenClaw browser workflows instead of treating browser QA as optional.

### Default split of responsibilities

- Use the `remote-opencli` skill when the browser-backed work should run through the remote OpenCLI stack on the Mac mini
- Use the `agent-browser` skill when you need deterministic interaction with a live browser session, including open, snapshot, and act steps

This split works well because `remote-opencli` is good for remote browser-backed orchestration and `agent-browser` is good for precise page interaction.

## Recommended QA sequence

1. Start the app locally or obtain the preview URL
2. If the run should happen through the remote Mac browser stack, use `remote-opencli` first to verify the remote OpenCLI environment is healthy
3. Open the target page in the browser session
4. Capture a snapshot before making assertions
5. Click through the real user flow
6. Compare the integrated result against the Stitch screenshot
7. Record issues, fix them in code, and rerun the same browser checks

## `agent-browser` defaults

When using the OpenClaw browser tool path, prefer these defaults:
- `target: "node"`
- `node: "Mac-Mini-Node"`
- `profile: "openclaw"`

Typical sequence:
- browser status
- browser start
- browser open
- browser snapshot
- browser act

If the browser session drops, restart it with the same profile and continue.

## `remote-opencli` defaults

Use the verified Mac mini route unless the user asks otherwise:
- SSH target: `xlmini@xlmini`
- prepend `PATH="/opt/homebrew/bin:$HOME/.bun/bin:$PATH"`
- verify with `opencli --version` and `opencli doctor`

Use this route when:
- the QA job is remote or long-running
- the page needs a real logged-in browser context on the Mac
- the work should be checked later instead of busy polling

## What to test in browser QA

At minimum:
- route loads correctly
- navigation works
- forms validate correctly
- loading, empty, and error states behave sensibly
- responsive layout holds at supported widths
- console is clean enough for the feature under test
- failed network requests are understood
- visual structure still matches the Stitch design intent

## How to use the results

A browser QA pass should produce one of two outputs:

### Pass
- route verified
- key interactions verified
- no blocking visual or functional issues

### Fix loop
- issue summary
- reproduction path
- expected behavior
- actual behavior
- screenshots or snapshots if helpful

Then patch the code and rerun the same browser checks.

## Fallback

If OpenClaw browser tooling is not available in the current environment, use Chrome DevTools MCP or the best available browser automation surface. Do not skip browser QA just because the preferred path is unavailable.
