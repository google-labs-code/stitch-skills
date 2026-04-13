---
description: Generate new screens from a text prompt using Stitch MCP.
---

# Workflow: Text-to-Design

Transform a text description into a high-fidelity Stitch design.

## Steps

### 1. Enhance the user prompt
Before calling the Stitch MCP tool, apply the [Prompt Enhancement Pipeline](../SKILL.md#prompt-enhancement-pipeline).
- Identify the platform and output type such as web page, mobile screen, or content carousel.
- Incorporate any existing design system from `.stitch/DESIGN.md`.
- Use specific [Design Mappings](../references/design-mappings.md) and [Prompting Keywords](../references/prompt-keywords.md).
- If the design is a multi-screen set, explicitly define the number of frames or screens and the role of each one.

### 2. Identify the project
Use `list_projects` to find the correct `projectId` if it is not already known.

### 3. Generate the screen or starting screen
Call the appropriate Stitch generation tool with the enhanced prompt.

```json
{
  "projectId": "...",
  "prompt": "[Your Enhanced Prompt]",
  "deviceType": "DESKTOP"
}
```

Use `MOBILE` when the target is mobile UI or mobile-first content such as social carousel posts.

### 4. Present AI feedback
Always show the text description and suggestions from `outputComponents` to the user.

### 5. Download design assets
After generation, download the HTML and screenshot URLs from `outputComponents` to `.stitch/designs`.
- **Naming**: Use a descriptive slug, and if the request is a series, preserve slide or screen order in the filenames.
- **Directory**: Ensure `.stitch/designs` exists.
- **Handoff**: If the design will move into implementation, keep filenames stable so downstream skills can reuse them.

### 6. Review and refine
- If the result is close but not right, use the [edit-design](edit-design.md) workflow.
- Do not regenerate from scratch unless the fundamental structure is wrong.
- If the result is part of a real delivery pipeline, hand off to `stitch-loop` or `react:components` after the design direction is accepted.

## Tips
- **Be structural**: Break the output into sections, screens, or slides.
- **Specify colors**: Use hex codes for precision.
- **Set the tone**: Explicitly mention whether the design should feel minimal, editorial, premium, playful, or data-dense.
- **For carousels**: Keep each frame focused on a single message and preserve consistent title, body, and CTA zones.
