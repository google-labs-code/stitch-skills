# Stitch Agent Skills

A library of Agent Skills designed to work with the Stitch MCP server. Each skill follows the Agent Skills open standard, for compatibility with coding agents such as Antigravity, Gemini CLI, Claude Code, Cursor.

## Installation & Discovery

Install any skill from this repository using the `add-skill` CLI. This command will automatically detect your active coding agents and place the skill in the appropriate directory.

```bash
# List all available skills in this repository
npx add-skill google-labs-code/stitch-skills --list

# Install a specific skill
npx add-skill google-labs-code/stitch-skills --skill react:components --global
```

## Available Skills

### design-md
Analyzes Stitch projects and generates comprehensive `DESIGN.md` files documenting design systems in natural, semantic language optimized for Stitch screen generation.

```bash
npx add-skill google-labs-code/stitch-skills --skill design-md --global
```

### react-components
Converts Stitch screens to React component systems with automated validation and design token consistency.

```bash
npx add-skill google-labs-code/stitch-skills --skill react:components --global
```

### stitch-loop
Generates a complete multi-page website from a single prompt using Stitch, with automated file organization and validation.

```bash
npx add-skill google-labs-code/stitch-skills --skill stitch-loop --global
```

### enhance-prompt
Transforms vague UI ideas into polished, Stitch-optimized prompts. Enhances specificity, adds UI/UX keywords, injects design system context, and structures output for better generation results.

```bash
npx add-skill google-labs-code/stitch-skills --skill enhance-prompt --global
```

## Repository Structure

Every directory within `skills/` or at the root level follows a standardized structure to ensure the AI agent has everything it needs to perform "few-shot" learning and automated quality checks.

```text
skills/[category]/
├── SKILL.md           — The "Mission Control" for the agent
├── scripts/           — Executable enforcers (Validation & Networking)
├── resources/         — The knowledge base (Checklists & Style Guides)
└── examples/          — The "Gold Standard" syntactically valid references
```

## Adding New Skills
All new skills need to follow the file structure above to implement the Agent Skills open standard.

### Great candidates for new skills
* **Validation**: Skills that convert Stitch HTML to other UI frameworks and validate the syntax.
* **Decoupling Data**: Skills that convert static design content into external mock data files.
* **Generate Designs**: Skills that generate new design screens in Stitch from a given set of data.

This is not an officially supported Google product. This project is not eligible for the [Google Open Source Software Vulnerability Rewards Program](https://bughunters.google.com/open-source-security).
