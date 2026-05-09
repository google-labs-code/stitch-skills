---
name: design-md
description: Analyze Stitch projects and synthesize a semantic design system into DESIGN.md files. Use when the user wants to document a Stitch project's design language, generate a DESIGN.md from existing screens, capture colors and typography from a Stitch URL, or prepare a design system reference for prompting future Stitch generations. Do NOT use for non-Stitch projects, raw CSS-to-design-token extraction outside Stitch, or live design editing in the Stitch app.
allowed-tools:
  - "stitch*:*"
  - "Read"
  - "Write"
  - "web_fetch"
---

# Stitch DESIGN.md Skill

You are an expert Design Systems Lead. Your goal is to analyze the provided technical assets and synthesize a "Semantic Design System" into a file named `DESIGN.md`.

## Overview

This skill helps you create `DESIGN.md` files that serve as the "source of truth" for prompting Stitch to generate new screens that align perfectly with existing design language. Stitch interprets design through "Visual Descriptions" supported by specific color values.

## Prerequisites

- Access to the Stitch MCP Server
- A Stitch project with at least one designed screen
- Access to the Stitch Effective Prompting Guide: https://stitch.withgoogle.com/docs/learn/prompting/

## The Goal

The `DESIGN.md` file will serve as the "source of truth" for prompting Stitch to generate new screens that align perfectly with the existing design language. Stitch interprets design through "Visual Descriptions" supported by specific color values.

## Retrieval and Networking

To analyze a Stitch project, you must retrieve screen metadata and design assets using the Stitch MCP Server tools:

1. **Namespace discovery**: Run `list_tools` to find the Stitch MCP prefix. Use this prefix (e.g., `mcp_stitch:`) for all subsequent calls.

2. **Project lookup** (if Project ID is not provided):
   - Call `[prefix]:list_projects` with `filter: "view=owned"` to retrieve all user projects
   - Identify the target project by title or URL pattern
   - Extract the Project ID from the `name` field (e.g., `projects/13534454087919359824`)

3. **Screen lookup** (if Screen ID is not provided):
   - Call `[prefix]:list_screens` with the `projectId` (just the numeric ID, not the full path)
   - Review screen titles to identify the target screen (e.g., "Home", "Landing Page")
   - Extract the Screen ID from the screen's `name` field

4. **Metadata fetch**: 
   - Call `[prefix]:get_screen` with both `projectId` and `screenId` (both as numeric IDs only)
   - This returns the complete screen object including:
     - `screenshot.downloadUrl` - Visual reference of the design
     - `htmlCode.downloadUrl` - Full HTML/CSS source code
     - `width`, `height`, `deviceType` - Screen dimensions and target platform
     - Project metadata including `designTheme` with color and style information

5. **Asset download**:
   - Use `web_fetch` or `read_url_content` to download the HTML code from `htmlCode.downloadUrl`
   - Optionally download the screenshot from `screenshot.downloadUrl` for visual reference
   - Parse the HTML to extract Tailwind classes, custom CSS, and component patterns

6. **Project metadata extraction**:
   - Call `[prefix]:get_project` with the project `name` (full path: `projects/{id}`) to get:
     - `designTheme` object with color mode, fonts, roundness, custom colors
     - Project-level design guidelines and descriptions
     - Device type preferences and layout principles

## Analysis & Synthesis Instructions

### 1. Extract Project Identity (JSON)
- Locate the Project Title
- Locate the specific Project ID (e.g., from the `name` field in the JSON)

### 2. Define the Atmosphere (Image/HTML)
Evaluate the screenshot and HTML structure to capture the overall "vibe." Use evocative adjectives to describe the mood (e.g., "Airy," "Dense," "Minimalist," "Utilitarian").

### 3. Map the Color Palette (Tailwind Config/JSON)
Identify the key colors in the system. For each color, provide:
- A descriptive, natural language name that conveys its character (e.g., "Deep Muted Teal-Navy")
- The specific hex code in parentheses for precision (e.g., "#294056")
- Its specific functional role (e.g., "Used for primary actions")

### 4. Translate Geometry & Shape (CSS/Tailwind)
Convert technical `border-radius` and layout values into physical descriptions:
- Describe `rounded-full` as "Pill-shaped"
- Describe `rounded-lg` as "Subtly rounded corners"
- Describe `rounded-none` as "Sharp, squared-off edges"

### 5. Describe Depth & Elevation
Explain how the UI handles layers. Describe the presence and quality of shadows (e.g., "Flat," "Whisper-soft diffused shadows," or "Heavy, high-contrast drop shadows").

## Output Guidelines

- **Language:** Use descriptive design terminology and natural language exclusively
- **Format:** Generate a clean Markdown file following the structure below
- **Precision:** Include exact hex codes for colors while using descriptive names
- **Context:** Explain the "why" behind design decisions, not just the "what"

## Output Format (DESIGN.md Structure)

```markdown
# Design System: [Project Title]
**Project ID:** [Insert Project ID Here]

## 1. Visual Theme & Atmosphere
(Description of the mood, density, and aesthetic philosophy.)

## 2. Color Palette & Roles
(List colors by Descriptive Name + Hex Code + Functional Role.)

## 3. Typography Rules
(Description of font family, weight usage for headers vs. body, and letter-spacing character.)

## 4. Component Stylings
* **Buttons:** (Shape description, color assignment, behavior).
* **Cards/Containers:** (Corner roundness description, background color, shadow depth).
* **Inputs/Forms:** (Stroke style, background).

## 5. Layout Principles
(Description of whitespace strategy, margins, and grid alignment.)
```

## Examples

### Example 1: Generate DESIGN.md from a single Stitch project

To use this skill for the Furniture Collection project:

1. **Retrieve project information:**
   ```
   Use the Stitch MCP Server to get the Furniture Collection project
   ```

2. **Get the Home page screen details:**
   ```
   Retrieve the Home page screen's code, image, and screen object information
   ```

3. **Reference best practices:**
   ```
   Review the Stitch Effective Prompting Guide at:
   https://stitch.withgoogle.com/docs/learn/prompting/
   ```

4. **Analyze and synthesize:**
   - Extract all relevant design tokens from the screen
   - Translate technical values into descriptive language
   - Organize information according to the DESIGN.md structure

5. **Generate the file:**
   - Create `DESIGN.md` in the project directory
   - Follow the prescribed format exactly
   - Ensure all color codes are accurate
   - Use evocative, designer-friendly language

### Example 2: Refresh DESIGN.md after redesigning a hero screen

If the project's hero screen has been redesigned in Stitch and the existing DESIGN.md no longer reflects the current visual language:

1. Call `[prefix]:list_screens` and identify the updated hero screen ID
2. Call `[prefix]:get_screen` to fetch the new HTML and screenshot
3. Compare the colours, typography, and component shapes against the existing DESIGN.md
4. Rewrite only the affected sections (Visual Theme, Color Palette, Component Stylings) instead of regenerating the whole file

### Example 3: Bootstrap DESIGN.md for a multi-screen project

When a project has several finished screens and no DESIGN.md yet:

1. List all screens and identify the most representative two or three (typically the home, a content page, and a form)
2. Fetch metadata for each
3. Cross-reference the colour usage and component shapes across screens to find the consistent system
4. Document only the patterns that appear in two or more screens; flag one-off colours or shapes as exceptions

## Best Practices

- **Be Descriptive:** Avoid generic terms like "blue" or "rounded." Use "Ocean-deep Cerulean (#0077B6)" or "Gently curved edges"
- **Be Functional:** Always explain what each design element is used for
- **Be Consistent:** Use the same terminology throughout the document
- **Be Visual:** Help readers visualize the design through your descriptions
- **Be Precise:** Include exact values (hex codes, pixel values) in parentheses after natural language descriptions

## Tips for Success

1. **Start with the big picture:** Understand the overall aesthetic before diving into details
2. **Look for patterns:** Identify consistent spacing, sizing, and styling patterns
3. **Think semantically:** Name colors by their purpose, not just their appearance
4. **Consider hierarchy:** Document how visual weight and importance are communicated
5. **Reference the guide:** Use language and patterns from the Stitch Effective Prompting Guide

## Common Pitfalls to Avoid

- ❌ Using technical jargon without translation (e.g., "rounded-xl" instead of "generously rounded corners")
- ❌ Omitting color codes or using only descriptive names
- ❌ Forgetting to explain functional roles of design elements
- ❌ Being too vague in atmosphere descriptions
- ❌ Ignoring subtle design details like shadows or spacing patterns

## Error Handling

| Symptom | Likely cause | What to do |
|---------|--------------|-----------|
| `list_tools` returns no Stitch entries | Stitch MCP Server not connected for this session | Confirm the user has installed and connected the Stitch MCP server, then re-run discovery |
| `list_projects` returns an empty array | The signed-in account has no Stitch projects, or the filter is too narrow | Ask the user to confirm the account, or call without `filter` to widen the result set |
| `get_project` returns 404 | The project ID was passed in the wrong shape | Pass the full resource path (`projects/{id}`) for `get_project`; pass the numeric ID alone for `list_screens` and `get_screen` |
| `htmlCode.downloadUrl` returns empty or malformed HTML | The screen has no committed design yet | Ask the user to finalise the screen in Stitch, or pick a different screen that has a download URL populated |
| Screenshot shows a low-resolution thumbnail | Default Google CDN thumbnail width | Append `=w{width}` to the screenshot URL using the `width` value from the screen metadata before fetching |
| `web_fetch` of `htmlCode.downloadUrl` blocked | The CDN requires the redirect chain to be followed | Retry once; if it still fails, capture the URL and ask the user to download manually so analysis can continue |
| Generated DESIGN.md is generic ("blue", "rounded") | The skill ran without consulting the screenshot or HTML | Re-read both assets and rewrite each section using the descriptive names + hex codes pattern from `Output Format` |
| Multiple screens disagree on a colour | The project has not converged on a system yet | Document the dominant pattern as the system; list the divergence as an "Exceptions" subsection rather than averaging the values |

If a step fails for an unlisted reason, capture the tool name, full input, and error response, then ask the user before retrying. Do not invent design tokens to fill gaps.
