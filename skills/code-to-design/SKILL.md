---
name: stitch::code-to-design
description: >-
  Convert frontend code (Vite, React, etc.) to a Stitch Design by chaining
  static HTML extraction, design system extraction, and file upload. **ALWAYS** use this skill when the user's intent is to move existing web apps or React components into Stitch (e.g., requests to "save", "migrate", or "upload"). You must use this skill even for simple "save" operations, as it is the only way to ensure the design system is extracted and assets are properly linked.
---

# Code to Design

Transform your existing frontend code into a Stitch Design so you can iterate and improve it using Stitch.

This skill orchestrates three other skills in sequence:
1. `extract-static-html`: Extract a single self-contained HTML file from your build output.
2. `extract-design-md`: Analyze the source code to create a design system (DESIGN.md).
3. `upload-to-stitch`: Upload that HTML file and the design system to your Stitch project.

## Workflow

Follow these steps to convert your existing code.

### Prerequisites

- A built web application directory containing `index.html` and assets.
- Target Stitch `projectId` (use `list_projects` if unknown).

### Steps

#### 1. Extract Self-Contained HTML

Delegate to the `extract-static-html` skill to generate a standalone HTML file.
Read [skills/extract-static-html/SKILL.md](../extract-static-html/SKILL.md) for detailed instructions and script usage.

Expected output: A single file like `/path/to/extracted/standalone.html`.

#### 2. Verify HTML (Optional — User-Driven)

After extraction, inform the user of the output file path so they can manually
verify in a browser if desired. **Do not block on verification** — proceed
directly to Step 3.

If the user reports issues after reviewing, fix them before continuing.

#### 3. Extract Design System (File)

Delegate to the `extract-design-md` skill to analyze the project's source files
(components, stylesheets, theme configs) and produce a design system. Read
[skills/extract-design-md/SKILL.md](../extract-design-md/SKILL.md) for the
full analysis workflow.

Write `.stitch/DESIGN.md` following the `extract-design-md` skill's output
structure.

#### 4. Create Design System in Stitch (MCP)

> [!WARNING]
> **Checkpoint — User Confirmation Required.**
> Before calling `upload_design_md` and proceeding to upload, you **MUST** pause and ask the user to review both the extracted static HTML file(s) and the generated `DESIGN.md`. Present a summary of the extracted design system (key colors, fonts, roundness, overall theme) and the path to the HTML file, and wait for explicit approval. Do **NOT** proceed until the user confirms.

> [!IMPORTANT]
> You **MUST** create the design system in the Stitch platform using the MCP tools. Do not just create the local file.
> 
> Follow the two-step pattern:
> 1. Call `upload_design_md` with the base64 encoded content of the `DESIGN.md` file and the `projectId`. This uploads the markdown and returns the source screen ID.
> 2. Immediately call `create_design_system_from_design_md` with the `projectId` and `selectedScreenInstance` (constructed using the returned source screen ID and fetching the screen instance ID from `get_project`).
> 
> Refer to the `manage-design-system` skill for detailed schemas and required fields.

#### 5. Upload to Stitch

Delegate to the `upload-to-stitch` skill to upload the extracted HTML file.
Read [skills/upload-to-stitch/SKILL.md](../upload-to-stitch/SKILL.md) for detailed instructions and script usage.

You will need:
- The path to the standalone HTML file generated in Step 1.
- Your Stitch API Key (see `upload-to-stitch` instructions for location).
- The target `projectId`.

#### 6. Apply Design System to Uploaded Screen (MCP)

> [!IMPORTANT]
> After uploading the screen, you **MUST** apply the created design system to the uploaded screen instance using `apply_design_system`. This ensures the screen renders with the correct visual styles in the Stitch canvas.
> 
> Get the instance ID from `get_project` (pass the project name as `projects/{id}`).

