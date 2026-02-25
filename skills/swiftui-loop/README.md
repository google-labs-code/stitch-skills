# SwiftUI Build Loop Skill

Teaches agents to iteratively build iOS SwiftUI views using Stitch mobile mockups with an autonomous baton-passing loop pattern.

## Install

```bash
npx skills add google-labs-code/stitch-skills --skill swiftui-loop --global
```

## What It Does

Enables continuous, autonomous iOS view development through a "baton" system:

1. Agent reads task from `next-prompt.md`
2. Generates mobile screen mockup via Stitch MCP tools
3. Translates the mockup into a SwiftUI `View` (`.swift`)
4. Integrates view into the app's navigation structure
5. Writes next task to continue the loop

## Prerequisites

- Stitch MCP Server access
- A `DESIGN.md` file (generate with the `design-md` skill, then extend with SwiftUI tokens)
- An `APP.md` file for project context

## Example Prompt

```text
Read my next-prompt.md and generate the SwiftUI view using Stitch, then prepare the next iteration.
```

## Skill Structure

```
swiftui-loop/
├── SKILL.md                    — Core pattern instructions
├── README.md                   — This file
├── resources/
│   ├── baton-schema.md         — Baton file format spec
│   └── app-template.md         — APP.md and DESIGN.md templates for SwiftUI
└── examples/
    ├── next-prompt.md           — Example baton
    └── APP.md                   — Example app constitution
```

## Works With

- **`design-md` skill**: Generate `DESIGN.md` from existing Stitch screens, then extend with SwiftUI tokens
- **CI/CD**: GitHub Actions can trigger new iterations on push
- **Agent chains**: Dispatch to other agents (Jules, etc.)

## Learn More

See [SKILL.md](./SKILL.md) for complete instructions.
