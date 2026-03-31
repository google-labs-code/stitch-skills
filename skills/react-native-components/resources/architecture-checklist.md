# Architecture Quality Gate — React Native

### Structural integrity
- [ ] Logic extracted to custom hooks in `src/hooks/`.
- [ ] No monolithic files; strictly modular component decomposition.
- [ ] All static text/URLs moved to `src/data/mockData.ts`.

### Type safety and syntax
- [ ] Props use `Readonly<T>` interfaces.
- [ ] File is syntactically valid TypeScript (no red squiggles).
- [ ] Placeholders from templates (e.g., `StitchComponent`) have been replaced with actual names.

### Native primitives
- [ ] Only React Native primitives used (`View`, `Text`, `Image`, `Pressable`, etc.).
- [ ] No HTML elements (`<div>`, `<span>`, `<p>`, `<button>`, `<img>`).
- [ ] All text content wrapped in `<Text>` components.
- [ ] Dynamic lists use `FlatList` or `SectionList` instead of mapped `ScrollView`.

### Styling and theming
- [ ] All styles defined via `StyleSheet.create()` (or `className` if NativeWind is configured).
- [ ] No hardcoded hex values; use theme-mapped constants from `style-guide.json`.
- [ ] Dark mode supported via `useColorScheme()` or theme provider.

### Platform handling
- [ ] iOS/Android differences handled via `Platform.select()` or `Platform.OS`.
- [ ] Screens wrapped with `SafeAreaView` where appropriate.
- [ ] Forms use `KeyboardAvoidingView` with correct `behavior` per platform.
- [ ] All interactive elements have minimum 44×44 point touch targets.

### Performance
- [ ] Pure display components wrapped with `React.memo()`.
- [ ] No anonymous arrow functions in `onPress` or `renderItem` props.
- [ ] Images specify explicit dimensions and `resizeMode`.
