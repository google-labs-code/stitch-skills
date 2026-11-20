# Flutter Component Architecture Checklist

## State Management
- [ ] Component extends `StatefulWidget`.
- [ ] Logic is isolated into helper methods within the `State` class.
- [ ] Proper use of `setState` for UI updates.

## UI & Styling
- [ ] No hardcoded hex color codes (use `Theme.of(context)` where possible).
- [ ] Responsive layout using `LayoutBuilder` or `MediaQuery` if needed.
- [ ] Material 3 design principles followed.
- [ ] Typography extracted from Design JSON.

## Code Quality
- [ ] All TODOs resolved.
- [ ] Proper indentation and formatting.
- [ ] Public constructor with optional parameters.
- [ ] No unused imports.
