# Stitch to React Agent Skills

A library of specialized agent skills designed to convert Stitch MCP designs into modular, production-ready Vite + React + TypeScript components.

## Quick Start

The fastest way to use these skills is via the `add-skill` CLI. This will automatically detect your coding agent (Claude Code, Cursor, Antigravity, etc.) and install the skill into the correct directory.

```bash
# Install the core component skill globally
npx add-skill davideast/stitch-to-react-skills --skill stitch-to-react-components --global

```

## Available Skills

| Skill Name | Description | Path |
| --- | --- | --- |
| `stitch-to-react-components` | Converts designs into modular components with AST validation and custom networking. | `skills/stitch-to-react-components` |

## Repository Structure

This repository follows the **Agent Skills** open standard. Each skill is self-contained with its own logic, validation scripts, and design tokens.

```text
skills/stitch-to-react-components/
├── SKILL.md           — Core instructions & workflow
├── package.json       — Validator dependencies
├── scripts/           — Networking & AST validation
├── resources/         — Style guides & API references
└── examples/          — Gold-standard code samples
```

## How it Works

When activated, the agent follows a high-fidelity engineering pipeline:

1. **Retrieval**: Uses a system-level `curl` script to bypass TLS/SNI issues on Google Cloud Storage.
2. **Mapping**: Cross-references Stitch metadata with the local `style-guide.json` to ensure token consistency.
3. **Generation**: Scaffolds components using a strict Atomic Design pattern.
4. **Validation**: Runs an automated AST check using `@swc/core` to prevent hardcoded hex values or missing interfaces.
5. **Audit**: Performs a final self-correction check against a 20-point architecture checklist.

## Requirements

* **Node.js**: v18 or higher (for the validation scripts).
* **Stitch MCP Server**: Must be configured in your IDE/CLI.
* **Environment**: A React + Vite + Tailwind project.

## Development

To add a new skill to this repository:

1. Create a new directory under `skills/`.
2. Ensure it contains a `SKILL.md` with a valid `name` and `description` in the YAML frontmatter.
3. Push to GitHub; `add-skill` will automatically discover the new entry.
