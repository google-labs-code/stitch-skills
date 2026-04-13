# Stitch Design Skill

Teaches agents to generate high-fidelity, consistent designs and maintain project-level design systems using Stitch.

## Install

```bash
npx skills add google-labs-code/stitch-skills --skill stitch-design --global
```

## What It Does

Enables professional-grade design workflows through Stitch MCP:

1. **Prompt Enhancement**: Transforms rough intent into structured, high-fidelity prompts with professional design terminology and system context.
2. **Design System Synthesis**: Analyzes existing Stitch projects to create and maintain a `.stitch/DESIGN.md` source of truth.
3. **Iterative Generation**: Selects the best generation or editing workflow based on user intent.
4. **Asset Management**: Synchronizes remote designs by downloading HTML and screenshots to `.stitch/designs`.
5. **Handoff Readiness**: Produces output that can move cleanly into `stitch-loop` or `react:components`.
6. **Content-System Support**: Works for app pages, web flows, and reusable content layouts such as social carousel posts.

## Prerequisites

- Stitch MCP Server access
- A project `projectId` if you are continuing an existing project

## Example Prompts

```text
Design a premium landing page for a mountain resort with a focus on serene luxury and glassmorphism.
```

```text
Design a 6-slide XiaohongShu-style carousel explaining why long-term investing beats chasing hot themes.
```

## Example Files

- `examples/enhanced-prompt.md`
- `examples/xiaohongshu-carousel-prompt.md`
- `examples/fullstack-handoff.md`

## Works With

- **`react:components`** for frontend implementation handoff
- **`stitch-loop`** for design to code to QA iteration loops
- **multi-agent workflows** that split design, implementation, QA, and fix passes

## Learn More

See [SKILL.md](./SKILL.md) for complete instructions.
