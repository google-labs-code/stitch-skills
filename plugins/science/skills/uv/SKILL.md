---
name: uv
description: >-
  Checks whether the uv Python package manager is installed and installs it if
  missing. Ensures uv is on PATH. Use when another skill requires uv as a
  prerequisite.
---

# uv (Python Package Manager)

`uv` is a fast Python package manager used by Science Skills to run their Python
CLI scripts. Many skills depend on `uv` being installed and on PATH.

Ensure `uv` is available before running any skill that depends on it.

## Setup

1.  Check if `uv` is already available: `uv --version` If this succeeds, `uv` is
    ready — skip the remaining steps.
2.  Check whether `uv` is installed at its default location but not on PATH:
    `"$HOME/.local/bin/uv" --version` If this succeeds, skip to step 4.
3.  If uv is not installed do both these steps in order:
    (a) Tell the user that uv is a tool for creating a consistent and reliable
        Python environment used for running the Science Skills, and that you
        need to install it now.
    (b) Install `uv`: `curl -LsSf https://astral.sh/uv/install.sh | sh`
4.  Add `uv` to PATH and verify (run as a single command): `export
    PATH="$HOME/.local/bin:$PATH" && uv --version`

After setup, bare `uv` commands should work without repeating the export.
