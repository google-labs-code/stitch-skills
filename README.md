# Stitch Agent Skills

A library of Agent Skills designed to work with the Stitch MCP server. Each skill follows the Agent Skills open standard, for compatibility with coding agents such as Antigravity, Gemini CLI, Claude Code, Cursor.

## Installation & Discovery

Install any skill from this repository using the `skills` CLI. This command will automatically detect your active coding agents and place the skill in the appropriate directory.

```bash
# List all available skills in this repository
npx skills add google-labs-code/stitch-skills --list

# Install a specific skill
npx skills add google-labs-code/stitch-skills --skill react:components --global
```

## Available Skills

### stitch-design
Unified entry point for Stitch design work. Handles prompt enhancement (UI/UX keywords, atmosphere), design system synthesis (`.stitch/DESIGN.md`), and high-fidelity screen generation and editing via Stitch MCP.

```bash
npx skills add google-labs-code/stitch-skills --skill stitch-design --global
```

### stitch-loop
Guides an agent through a full Stitch design-to-code loop: prompt and baton intake, Stitch generation, repo integration, browser QA, review, fix, retest, and next-iteration handoff.

```bash
npx skills add google-labs-code/stitch-skills --skill stitch-loop --global
```

Key resources inside this skill:
- `skills/stitch-loop/resources/fullstack-playbook.md`
- `skills/stitch-loop/resources/stitch-mcp-setup.md`
- `skills/stitch-loop/resources/openclaw-browser-qa.md`

### design-md
Analyzes Stitch projects and generates comprehensive `DESIGN.md` files documenting design systems in natural, semantic language optimized for Stitch screen generation.

```bash
npx skills add google-labs-code/stitch-skills --skill design-md --global
```

### enhance-prompt
Transforms vague UI ideas into polished, Stitch-optimized prompts. Enhances specificity, adds UI/UX keywords, injects design system context, and structures output for better generation results.

```bash
npx skills add google-labs-code/stitch-skills --skill enhance-prompt --global
```

### react-components
Converts Stitch screens to React component systems with automated validation and design token consistency.

```bash
npx skills add google-labs-code/stitch-skills --skill react:components --global
```

### remotion
Generates walkthrough videos from Stitch projects using Remotion with smooth transitions, zooming, and text overlays to showcase app screens professionally.

```bash
npx skills add google-labs-code/stitch-skills --skill remotion --global
```

### shadcn-ui
Expert guidance for integrating and building applications with shadcn/ui components. Helps discover, install, customize, and optimize shadcn/ui components with best practices for React applications.

```bash
npx skills add google-labs-code/stitch-skills --skill shadcn-ui --global
```

## Recommended Design-to-Code Flow

A practical full-stack flow with this repo looks like this:

1. Use `stitch-design` to refine prompts and stabilize the design system
2. Use `design-md` if `.stitch/DESIGN.md` does not exist yet
3. Use `stitch-loop` to run the delivery loop from design through integration and QA
4. Use `react:components` when Stitch output needs to become modular React code
5. Run real browser QA before calling the slice done

## Repository Structure

Every directory within `skills/` or at the root level follows a standardized structure to ensure the AI agent has everything it needs to perform few-shot learning and automated quality checks.

```text
skills/[category]/
├── SKILL.md           - The mission control for the agent
├── scripts/           - Executable enforcers (validation and networking)
├── resources/         - The knowledge base (checklists and style guides)
└── examples/          - Gold-standard references
```

## Adding New Skills

All new skills need to follow the file structure above to implement the Agent Skills open standard.

### Great candidates for new skills

- **Validation**: Skills that convert Stitch HTML to other UI frameworks and validate the syntax
- **Decoupling Data**: Skills that convert static design content into external mock data files
- **Generate Designs**: Skills that generate new design screens in Stitch from a given set of data

This is not an officially supported Google product. This project is not eligible for the [Google Open Source Software Vulnerability Rewards Program](https://bughunters.google.com/open-source-security).
