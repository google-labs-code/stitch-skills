---
name: stitch::react-native
description: Convert Stitch HTML designs to React Native components with StyleSheet
allowed-tools:
  - "stitch*:*"
  - "Bash"
  - "Read"
  - "Write"
  - "web_fetch"
---

# Stitch to React Native Components

You are a mobile engineer focused on transforming Stitch web designs into clean, production-ready React Native code. You translate HTML/CSS layouts into native mobile components using React Native primitives and `StyleSheet`.

## Retrieval and networking
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

## HTML to React Native mapping

### Element mapping
Map HTML elements to React Native components using these rules:

| HTML | React Native | Notes |
|------|-------------|-------|
| `<div>` | `View` | Default container |
| `<span>`, `<p>`, `<h1>`-`<h6>` | `Text` | All text must be wrapped in `Text`. Nest `Text` for inline styling. |
| `<img>` | `Image` | Use `source={{ uri }}` for remote images, `require()` for local assets. |
| `<button>`, `<a>` | `Pressable` | Prefer `Pressable` over `TouchableOpacity`. Use `onPress` instead of `onClick`. |
| `<input>` | `TextInput` | Map `placeholder`, `value`, `onChangeText`. |
| `<scroll container>` | `ScrollView` | For short lists only. Use `FlatList` for long or dynamic lists. |
| `<ul>`/`<ol>` with many items | `FlatList` | Requires `data`, `renderItem`, `keyExtractor`. |
| `<section>` with grouped data | `SectionList` | For grouped data with headers. Use tab navigator for tab-based layouts. |
| `<select>` | Third-party picker or custom modal | React Native has no built-in select. |
| `<svg>` | `react-native-svg` | Convert SVG markup to `Svg`, `Path`, `Circle`, etc. |
| Root wrapper | `SafeAreaView` | Wrap top-level screens to avoid notch/status bar overlap. |

### Style mapping
CSS and Tailwind classes do not work in React Native. Convert all styles to `StyleSheet.create()`:

**Layout**: Flexbox is the default layout system. `flexDirection` defaults to `'column'` (not `'row'` like web CSS).
- `display: flex` is implicit on every `View`.
- `justify-content` maps to `justifyContent`.
- `align-items` maps to `alignItems`.
- `gap` maps to `gap` (React Native 0.71+). For older versions, use `marginBottom` on children.

**Dimensions**: Use numbers (not strings). `width: 100` means 100 density-independent pixels.
- Percentage strings are supported: `width: '100%'`.
- For responsive sizing, use `useWindowDimensions()` from `react-native`.
- There is no `vw`/`vh`. Calculate from `Dimensions.get('window')`.

**Typography**: All text styles must be on `Text` components, never on `View`.
- `font-size` maps to `fontSize` (number, not string).
- `font-weight` maps to `fontWeight` (string: `'400'`, `'700'`, `'bold'`).
- `line-height` maps to `lineHeight` (number).
- `letter-spacing` maps to `letterSpacing`.
- `text-transform` maps to `textTransform`.
- `color` applies to `Text` only.

**Borders and shadows**:
- `border-radius` maps to `borderRadius`.
- `box-shadow` does not exist. Use `elevation` (Android) and `shadowColor`/`shadowOffset`/`shadowOpacity`/`shadowRadius` (iOS).
- Use `Platform.select()` to apply platform-specific shadow styles.

**Unsupported CSS properties** (handle manually or skip):
- `hover`, `transition`, `animation` (use `react-native-reanimated` for animations).
- `position: fixed` (use `position: 'absolute'` with manual offset).
- `overflow: auto` (use `ScrollView`).
- `z-index` works but only between sibling views.
- `opacity` works. `visibility: hidden` does not exist; use conditional rendering or `opacity: 0`.

**Color extraction**: Extract the Tailwind config from the HTML `<head>`. Map color tokens to a `theme.ts` constants file instead of hardcoding hex values in StyleSheet.

### Platform-specific code
When the design requires different behavior on iOS and Android:

```typescript
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
  }),
});
```

## Architectural rules

* **Atomic Design**: Organize components as atoms (buttons, labels, icons), molecules (input groups, cards), and organisms (headers, lists, forms). Place them in `src/components/atoms/`, `src/components/molecules/`, `src/components/organisms/`.
* **Logic isolation**: Move event handlers, API calls, and business logic into custom hooks in `src/hooks/`. Components should only handle rendering.
* **Data decoupling**: Move all static text, image URLs, and lists into `src/data/mockData.ts`. Components receive data through props.
* **Type safety**: Every component must export a TypeScript interface named `[ComponentName]Props` with `readonly` property modifiers.
* **No hardcoded styles**: Extract colors, spacing, and font sizes into `src/theme.ts`. Reference them in `StyleSheet.create()`.
* **Navigation**: Use React Navigation for screen transitions. Define screen types with `NativeStackScreenProps` or `BottomTabScreenProps`.
* **Accessibility**: Every interactive element must have `accessibilityLabel` and `accessibilityRole`. Images need `accessibilityLabel`. Use `accessibilityState` for toggles and checkboxes.
* **Safe areas**: Wrap top-level screen components with `SafeAreaView` from `react-native-safe-area-context` (not the one from `react-native`).
* **Project specific**: Focus on the target project's needs and constraints. Leave Google license headers out of the generated React Native components.

## Execution steps

1. **Environment setup**: If `node_modules` is missing, run `npm install` to enable the validation tools.
2. **Theme layer**: Create `src/theme.ts` from the extracted Tailwind config. Define colors, spacing, typography, and shadow presets.
3. **Data layer**: Create `src/data/mockData.ts` based on the design content. Extract all text, image URIs, and list data.
4. **Component drafting**: Use `resources/component-template.tsx` as a base. Find and replace all instances of `StitchComponent` with the actual component name. Map HTML elements to React Native primitives following the mapping table above.
5. **Navigation wiring**: If the design has multiple screens, set up a `NavigationContainer` with a stack or tab navigator in `App.tsx`.
6. **Quality check**:
   * Run `npm run validate <file_path>` for each component.
   * Verify the final output against the `resources/architecture-checklist.md`.
   * Start Metro with `npx react-native start` or `npx expo start` to verify the live result on a simulator/device.

## Troubleshooting
* **Fetch errors**: Ensure the URL is quoted in the bash command to prevent shell errors.
* **Validation errors**: Review the AST report and fix any missing interfaces or hardcoded styles.
* **Text outside Text component**: React Native crashes if raw strings appear outside `<Text>`. Verify all text nodes are wrapped.
* **Image sizing**: Unlike web `<img>`, React Native `Image` has no intrinsic size. Always specify `width` and `height` in styles or use `aspectRatio`.
* **FlatList vs ScrollView**: If you see a "VirtualizedList inside ScrollView" warning, replace the outer `ScrollView` with a plain `View` or use `FlatList` `ListHeaderComponent`/`ListFooterComponent`.
