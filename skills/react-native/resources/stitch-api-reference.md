# Stitch API reference

This document describes the data structures returned by the Stitch MCP server, with notes specific to the React Native target.

### Metadata schema
When calling `get_screen`, the server returns a JSON object with these key properties:
* **htmlCode**: Contains a `downloadUrl`. This is a signed URL that requires a system-level fetch (`scripts/fetch-stitch.sh`) to handle redirects and security handshakes.
* **screenshot**: Includes a `downloadUrl` for the visual design. Append `=w{width}` to the URL (using the screen's `width` value) before downloading, since the CDN serves low-res thumbnails by default. Use the screenshot to verify layout intent that the raw HTML does not make obvious.
* **width**: The base layout width of the design. Treat this as a reference for proportions only — do not hardcode it. React Native uses density-independent pixels, so derive responsive sizes from `useWindowDimensions()` or `Dimensions.get('window')` rather than the source viewport.
* **deviceType**: May be `DESKTOP` or a mobile form factor. Regardless of value, the generated output targets native mobile primitives and a flexible, single-column-first layout.

### Technical mapping rules
1. **Element tracking**: Preserve `data-stitch-id` attributes as comments in the TSX to allow for future design synchronization.
2. **Asset handling**: Treat background images and remote URLs in the HTML as dynamic data. Extract them into `src/data/mockData.ts` and pass them to `Image` via `source={{ uri }}` rather than hardcoding them into `StyleSheet`.
3. **Style extraction**: The HTML `<head>` contains a localized `tailwind.config`. Tailwind classes do not run in React Native, so map these tokens into `resources/style-guide.json` (and a generated `src/theme.ts`) instead of merging a web config. Reference the theme constants from `StyleSheet.create()` so colors like `primary` and `background.dark` render consistently across iOS and Android.
