# Stitch Full-Stack Delivery Loop Skill

Turns Stitch into an end-to-end frontend delivery loop instead of a one-off design export.

## Install

```bash
npx skills add google-labs-code/stitch-skills --skill stitch-loop --global
```

## What It Does

This skill teaches an agent to run the full loop:

1. Read the current baton from `.stitch/next-prompt.md`
2. Generate or refine the design in Stitch
3. Pull HTML and screenshots into the repo
4. Integrate the design into the real frontend codebase
5. Run browser QA on the integrated app
6. Review findings, fix issues, and retest
7. Write the next baton so the loop continues

## What It Assumes

- Stitch MCP access is available, or will be set up first
- The project keeps `.stitch/DESIGN.md`, `.stitch/SITE.md`, `.stitch/metadata.json`, and `.stitch/next-prompt.md`
- The generated design still needs real frontend integration work
- Browser QA is part of the definition of done

## Key Resources

- `resources/fullstack-playbook.md` for the delivery phases and exit criteria
- `resources/stitch-mcp-setup.md` for setting up Stitch MCP and agent access
- `resources/openclaw-browser-qa.md` for OpenClaw and OpenCLI browser QA guidance
- `resources/baton-schema.md` for baton format details
- `resources/site-template.md` for bootstrapping project files

## Works With

- **`stitch-design`** for prompt enhancement and design-system creation
- **`react:components`** for turning Stitch output into modular React code
- **OpenClaw browser workflows** for browser-backed QA and fix verification
- **CI/CD or human review** for approving each iteration before the next baton is consumed

## Recommended Use

Use this skill when you want Stitch to sit inside a repeatable product workflow:

- product brief to screen generation
- screen generation to app integration
- app integration to browser QA
- QA findings to fixes and retest

## Learn More

See [SKILL.md](./SKILL.md) for the full operating instructions.
