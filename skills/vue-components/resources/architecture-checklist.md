# Architecture Quality Gate

### Structural integrity
- [ ] Logic extracted to composables in `src/composables/` (prefixed with `use`).
- [ ] No monolithic files; strictly Atomic/Composite modularity.
- [ ] All static text/URLs moved to `src/data/mockData.ts`.

### Type safety and syntax
- [ ] Props declared with `defineProps<Props>()` (typed generic, not runtime object).
- [ ] `withDefaults` used when any prop has a default value.
- [ ] Emits declared with `defineEmits<{ ... }>()` if the component emits events.
- [ ] File is syntactically valid Vue SFC (no parse errors).
- [ ] Placeholders from templates (e.g., `StitchComponent`) have been replaced with actual names.

### Reactivity
- [ ] Props accessed via `props.x`, not destructured directly.
- [ ] Derived state uses `computed()`, not local `ref` copies of props.

### Styling and theming
- [ ] Dark mode (`dark:`) applied to all color classes.
- [ ] No hardcoded hex values in template — use theme-mapped Tailwind classes.
