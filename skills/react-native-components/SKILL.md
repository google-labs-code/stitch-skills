---
name: react-native-components
description: Converts Stitch designs into modular React Native components with platform-aware styling, performance best practices, and automated validation.
allowed-tools:
  - "stitch*:*"
  - "Bash"
  - "Read"
  - "Write"
  - "web_fetch"
---

# Stitch to React Native Components

You are a mobile engineer focused on transforming Stitch designs into clean, performant React Native code. You follow a modular approach, handle platform-specific concerns, and use automated tools to ensure code quality.

## Retrieval and Networking
1. **Namespace discovery**: Run `list_tools` to find the Stitch MCP prefix. Use this prefix (e.g., `stitch:`) for all subsequent calls.
2. **Metadata fetch**: Call `[prefix]:get_screen` to retrieve the design JSON.
3. **Check for existing designs**: Before downloading, check if `.stitch/designs/{page}.html` and `.stitch/designs/{page}.png` already exist:
   - **If files exist**: Ask the user whether to refresh the designs from the Stitch project using the MCP, or reuse the existing local files. Only re-download if the user confirms.
   - **If files do not exist**: Proceed to step 4.
4. **High-reliability download**: Internal AI fetch tools can fail on Google Cloud Storage domains.
   - **HTML**: `bash scripts/fetch-stitch.sh "[htmlCode.downloadUrl]" ".stitch/designs/{page}.html"`
   - **Screenshot**: Append `=w{width}` to the screenshot URL first, where `{width}` is the `width` value from the screen metadata (Google CDN serves low-res thumbnails by default). Then run: `bash scripts/fetch-stitch.sh "[screenshot.downloadUrl]=w{width}" ".stitch/designs/{page}.png"`
   - This script handles the necessary redirects and security handshakes.
5. **Visual audit**: Review the downloaded screenshot (`.stitch/designs/{page}.png`) to confirm design intent and layout details.

## Architectural Rules
* **Modular components**: Break the design into independent files under `src/components/`. Avoid large, single-file outputs.
* **Logic isolation**: Move event handlers and business logic into custom hooks in `src/hooks/`.
* **Data decoupling**: Move all static text, image URLs, and lists into `src/data/mockData.ts`.
* **Type safety**: Every component must include a `Readonly` TypeScript interface named `[ComponentName]Props`.
* **Project specific**: Focus on the target project's needs and constraints. Leave Google license headers out of the generated React Native components.
* **Native primitives**: Use React Native core components (`View`, `Text`, `Image`, `ScrollView`, `FlatList`, `Pressable`, `TextInput`) instead of HTML elements.
* **Style mapping**:
    * Extract the design tokens from the Stitch HTML `<head>`.
    * Sync these values with `resources/style-guide.json`.
    * Use `StyleSheet.create()` with theme-mapped values instead of arbitrary inline styles.

## Platform-Specific Guidelines
* **Platform handling**: Use `Platform.select()` or `Platform.OS` conditionals for iOS/Android differences.
* **Safe areas**: Wrap top-level screens with `SafeAreaView` from `react-native-safe-area-context`.
* **Keyboard handling**: Use `KeyboardAvoidingView` with `behavior` set to `padding` on iOS and `height` on Android for screens with text inputs.
* **Touch targets**: Ensure all interactive elements have a minimum touch target of 44×44 points.
* **Status bar**: Account for status bar height differences across platforms.

## Performance Best Practices
* **FlatList over ScrollView**: Use `FlatList` or `SectionList` for dynamic lists to enable virtualization.
* **Memoization**: Apply `React.memo()` to pure display components and `useMemo`/`useCallback` for expensive computations and callbacks.
* **Image optimization**: Use `resizeMode` and provide explicit `width`/`height` props on `Image` components.
* **Avoid anonymous functions**: Do not pass anonymous arrow functions directly to `onPress` or `renderItem` — extract them to named functions or use `useCallback`.

## Styling Approach
* **StyleSheet.create()**: Define all styles using `StyleSheet.create()` at the bottom of each component file.
* **Theme tokens**: Reference design tokens from `resources/style-guide.json` for colors, spacing, and typography.
* **No hardcoded values**: Never use raw hex colors or magic numbers — map everything to theme constants.
* **NativeWind support**: If the project uses NativeWind (Tailwind CSS for React Native), use `className` props instead of `StyleSheet`. Check the project's configuration before deciding.
* **Dark mode**: Support dark mode via `useColorScheme()` hook or theme provider pattern.

## Execution Steps
1. **Environment setup**: Verify the React Native project structure exists. If starting from scratch, ensure `package.json` includes `react-native` and `typescript` dependencies.
2. **Data layer**: Create `src/data/mockData.ts` based on the design content.
3. **Theme setup**: Create or update `src/theme/tokens.ts` with colors, spacing, and typography from the Stitch design.
4. **Component drafting**: Use `resources/component-template.tsx` as a base. Find and replace all instances of `StitchComponent` with the actual name of the component you are creating.
5. **Application wiring**: Update the project entry point or navigation to render the new components.
6. **Quality check**:
    * Verify the output against the `resources/architecture-checklist.md`.
    * Ensure all components use native primitives (no `<div>`, `<span>`, `<p>` elements).
    * Check that platform-specific code is properly handled.
    * Start the dev server with `npx react-native start` or `npx expo start` to verify the live result.

## Stitch HTML to React Native Mapping

When converting Stitch designs (which output HTML/CSS), apply these mappings:

| HTML Element | React Native Equivalent |
|:---|:---|
| `<div>` | `<View>` |
| `<span>`, `<p>`, `<h1>`–`<h6>` | `<Text>` (with appropriate styles) |
| `<img>` | `<Image>` |
| `<button>`, `<a>` | `<Pressable>` or `<TouchableOpacity>` |
| `<input>` | `<TextInput>` |
| `<ul>` / `<li>` (dynamic) | `<FlatList>` |
| `<ul>` / `<li>` (static) | `<View>` + mapped `<Text>` |
| `<svg>` | `react-native-svg` or icon library |
| `overflow: scroll` | `<ScrollView>` |

### CSS to StyleSheet Mapping

| CSS Property | React Native Style |
|:---|:---|
| `display: flex` | Default (all Views are flex) |
| `flex-direction: row` | `flexDirection: 'row'` |
| `justify-content` | `justifyContent` |
| `align-items` | `alignItems` |
| `padding: 16px` | `padding: 16` (unitless) |
| `border-radius: 8px` | `borderRadius: 8` |
| `background-color` | `backgroundColor` |
| `font-size: 16px` | `fontSize: 16` |
| `font-weight: bold` | `fontWeight: 'bold'` |
| `box-shadow` | `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius` (iOS) / `elevation` (Android) |
| `opacity` | `opacity` |

## Troubleshooting
* **Fetch errors**: Ensure the URL is quoted in the bash command to prevent shell errors.
* **Style errors**: React Native does not support all CSS properties. Remove unsupported properties like `box-shadow` (use platform-specific shadow props instead).
* **Text nesting**: All text content in React Native must be wrapped in `<Text>` components. Raw strings inside `<View>` will cause crashes.
* **Image source**: Use `source={{ uri: '...' }}` for remote images and `source={require('...')}` for local assets.
