# vue:components

Converts Stitch designs into modular **Vue 3** Single File Components using the Composition API (`<script setup lang="ts">`).

## Prerequisites

- Node.js >= 18
- A Vite + Vue 3 project (target output directory)
- Stitch MCP server connected (or existing `.stitch/designs/` files)

## Setup

```bash
npm install
```

## Usage

```bash
# Validate a single component
npm run validate src/components/MyCard.vue

# Download a Stitch design asset
npm run fetch "<url>" ".stitch/designs/home.html"
```

## Skill conventions

| Pattern | Vue 3 implementation |
|---|---|
| Component props | `defineProps<Props>()` с типизированными дженериками в `<script setup>` |
| Props с дефолтами | `withDefaults(defineProps<Props>(), { ... })` |
| Переиспользуемая логика | Composables в `src/composables/` с префиксом `use` |
| Контент-слот | `<slot />` в шаблоне |
| Динамические классы | `:class="['base', condition ? 'a' : 'b']"` |
| Реактивные переменные | `ref()` для примитивов, `reactive()` для объектов |
| Производное состояние | `computed(() => ...)` — не дублировать пропсы в `ref` |
| Побочные эффекты | `watch()` / `watchEffect()` |
| События | `defineEmits<{ eventName: [payload: Type] }>()` |

## Validator checks

1. **Typed `defineProps`** — must use `defineProps<YourProps>()` (not runtime object syntax)
2. **No hardcoded hex colors** — use theme-mapped Tailwind classes from `resources/style-guide.json`
