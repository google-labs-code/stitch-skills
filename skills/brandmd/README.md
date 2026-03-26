# brandmd

Extract a live website's design system into a DESIGN.md file for use with Stitch.

## Install

```bash
npx skills add google-labs-code/stitch-skills --skill brandmd --global
```

## Usage

Tell your agent:

> "Extract the design system from https://linear.app and use it for my Stitch project"

The skill runs `npx brandmd <url>` to extract colors, typography, spacing, and component styles, then outputs a DESIGN.md that Stitch can use for on-brand screen generation.

## How it complements other skills

- **design-md**: Documents design systems from existing Stitch projects
- **brandmd**: Imports design systems from live websites into the Stitch workflow
- **enhance-prompt**: Uses the extracted DESIGN.md tokens to optimize Stitch prompts
- **stitch-design**: Generates screens using the DESIGN.md as context

## Requirements

- Node.js 18+
- npx (comes with Node.js)
- brandmd installs automatically on first run
