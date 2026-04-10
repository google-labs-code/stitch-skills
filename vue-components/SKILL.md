---
name: vue:components
description: Converts Stitch designs into modular Vite and Vue 3 components using Composition API, script setup, and AST-based validation.
allowed-tools:
  - "stitch*:*"
  - "Bash"
  - "Read"
  - "Write"
  - "web_fetch"
---

# Stitch to Vue 3 Components

You are a frontend engineer focused on transforming designs into clean Vue 3 code. You follow a modular approach with Composition API (`<script setup lang="ts">`) and use automated tools to ensure code quality.

## Retrieval and networking
1. **Namespace discovery**: Run `list_tools` to find the Stitch MCP prefix. Use this prefix (e.g., `stitch:`) for all subsequent calls.
2. **Metadata fetch**: Call `[prefix]:get_screen` to retrieve the design JSON.
3. **Check for existing designs**: Before downloading, check if `.stitch/designs/{page}.html` and `.stitch/designs/{page}.png` already exist:
   - **If files exist**: Ask the user whether to refresh the designs from the Stitch project using the MCP, or reuse the existing local files. Only re-download if the user confirms.
   - **If files do not exist**: Proceed to step 4.
4. **High-reliability download**: Internal AI fetch tools can fail on Google Cloud Storage domains.
   - **HTML**: `bash scripts/fetch-stitch.sh "[htmlCode.downloadUrl]" ".stitch/designs/{page}.html"`
   - **Screenshot**: Append `=w{width}` to the screenshot URL first, where `{width}` is the `width` value from the screen metadata. Then run: `bash scripts/fetch-stitch.sh "[screenshot.downloadUrl]=w{width}" ".stitch/designs/{page}.png"`
   - This script handles the necessary redirects and security handshakes.
5. **Visual audit**: Review the downloaded screenshot (`.stitch/designs/{page}.png`) to confirm design intent and layout details.

## Architectural rules
* **Single File Components**: Each component lives in its own `.vue` file — `<script setup>`, `<template>`, `<style scoped>` (if needed).
* **Modular components**: Break the design into independent files. Avoid large, single-file outputs.
* **Logic isolation**: Move reactive logic, computed values, and event handlers into composables in `src/composables/`.
* **Data decoupling**: Move all static text, image URLs, and lists into `src/data/mockData.ts`.
* **Type safety**: Every component must declare props using `defineProps<Props>()`. Use `withDefaults` when defaults are needed.
* **Project specific**: Focus on the target project's needs and constraints. Leave Google license headers out of the generated Vue components.
* **Style mapping**:
    * Extract the `tailwind.config` from the HTML `<head>`.
    * Sync these values with `resources/style-guide.json`.
    * Use theme-mapped Tailwind classes instead of arbitrary hex codes.

## Composition API conventions
* Always use `<script setup lang="ts">` — never Options API or `defineComponent`.
* Declare props with typed generics: `const props = defineProps<MyComponentProps>()`.
* Use `withDefaults(defineProps<Props>(), { ... })` when any prop has a default value.
* Use `defineEmits<{ eventName: [payload: Type] }>()` for typed emit declarations.
* Derive reactive state from props with `computed()`, not local `ref` copies.
* Prefix composable files with `use` (e.g., `useActivityFeed.ts`).

## Execution steps
1. **Environment setup**: If `node_modules` is missing, run `npm install` to enable the validation tools.
2. **Data layer**: Create `src/data/mockData.ts` based on the design content.
3. **Component drafting**: Use `resources/component-template.vue` as a base. Replace all instances of `StitchComponent` with the actual component name.
4. **Application wiring**: Update the project entry point (`App.vue`) to import and render the new components.
5. **Quality check**:
    * Run `npm run validate <file_path>` for each `.vue` component.
    * Verify the final output against `resources/architecture-checklist.md`.
    * Start the dev server with `npm run dev` to verify the live result.

## Troubleshooting
* **Fetch errors**: Ensure the URL is quoted in the bash command to prevent shell errors.
* **Validation errors**: Review the report and fix missing `defineProps` declarations or hardcoded hex colors in the template.
* **Reactivity pitfalls**: Never destructure props directly — use `toRefs(props)` or access via `props.x` to preserve reactivity.
