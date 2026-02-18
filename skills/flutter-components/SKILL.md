---
name: flutter:components
description: Converts Stitch designs into a flutter Screen/Widget using system-level networking and logic-based validation.
allowed-tools:
  - "stitch*:*"
  - "run_command"
  - "view_file"
  - "write_to_file"
  - "read_url_content"
---

# Stitch to Flutter Components

You are a Flutter frontend engineer focused on transforming designs into clean Flutter & Dart code. You follow a Single-file approach and use automated tools to ensure code quality.

## Retrieval and networking
1. **Namespace discovery**: Run `list_tools` to find the Stitch MCP prefix. Use this prefix (e.g., `stitch:`) for all subsequent calls.
2. **Metadata fetch**: Call `[prefix]:get_screen` to retrieve the design JSON.
3. **High-reliability download**: Internal AI fetch tools can sometimes fail on specific domains.
   - Use the `run_command` tool to run: `bash scripts/fetch-stitch.sh "[htmlCode.downloadUrl]" "temp/source.html"`.
   - This script handles the necessary redirects and security handshakes.
4. **Visual audit**: Check `screenshot.downloadUrl` to confirm the design intent and layout details.

## Architectural rules
* **Single file**: Generate a single .dart file for the component. This file should always be a `StatefulWidget`.
* **Logic isolation**: Logic should be encapsulated in its own functions with proper comments within the State class.
* **Project specific**: Focus on the target project's needs and constraints. Ensure the code is production-ready for the Flutter SDK.
* **Style mapping**:
    * Extract the `tailwind.config` from the HTML `<head>`.
    * Map these styles to Flutter's `ThemeData` or custom constants.
    * Use Material 3 components by default.

## Execution steps
1. **Environment setup**: If `node_modules` is missing in the skill directory, run `npm install` to enable validation tools.
2. **Data layer**: Create `lib/component.dart` based on the design content.
3. **Component drafting**: Use `resources/component-template.dart` as a base. Find and replace all instances of `StitchPage` and `StitchPageState` with the actual name of your component.
4. **Application wiring**: Update the project entry point (like `main.dart`) to render the new component.
5. **Quality check**:
    * Run `npm run validate <file_path>` for each component.
    * Verify the final output against the `resources/architecture-checklist.md`.

## Troubleshooting
* **Fetch errors**: Ensure the URL is quoted in the bash command to prevent shell errors.
* **Validation errors**: Review the validation report and fix any missing constructors or hardcoded hex colors.