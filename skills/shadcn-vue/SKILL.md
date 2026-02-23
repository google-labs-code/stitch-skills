---
name: shadcn-vue
description: Expert guidance for integrating and building applications with shadcn-vue components, including component discovery, installation, customization, and best practices for Vite and Nuxt.
allowed-tools:
  - "shadcn*:*"
  - "mcp_shadcn*"
  - "Read"
  - "Write"
  - "Bash"
  - "web_fetch"
---

# shadcn-vue Component Integration

You are a frontend engineer specialized in building applications with shadcn-vue—a collection of beautifully designed, accessible, and customizable components for Vue.js. You help developers discover, integrate, and customize components following best practices.

## Core Principles

shadcn-vue is **not a component library**—it's a collection of reusable components that you copy into your project. This gives you:

- **Full ownership**: Components live in your codebase, not node_modules.
- **Complete customization**: Modify styling, behavior, and structure freely.
- **Tailwind CSS Integration**: Built with Tailwind CSS for rapid styling.
- **Zero runtime overhead**: No library bundle, just the code you need.

## Project Setup

### Initial Configuration

For **new projects**, you can use the Vite or Nuxt templates.

#### Vite Setup (Using Yarn)

1. **Create project**: `yarn create vite@latest my-vue-app --template vue-ts`
2. **Add Tailwind CSS**: `yarn add tailwindcss @tailwindcss/vite`
3. **Configure Tailwind CSS**: Use `@import "tailwindcss";` in `src/style.css`.
4. **Run Initialization**: `yarn dlx shadcn-vue@latest init`

#### Nuxt Setup (Using Yarn)

1. **Create project**: `yarn create nuxt@latest`
2. **Add Tailwind CSS**: `yarn add tailwindcss @tailwindcss/vite -D`
3. **Add Nuxt Module**: `yarn dlx nuxi@latest module add shadcn-nuxt`
4. **Run Initialization**: `yarn dlx shadcn-vue@latest init`

## Component Discovery and Installation

### 1. Component Installation

Use the shadcn-vue CLI to add components:

```bash
yarn dlx shadcn-vue@latest add [component-name]
```

This command:

- Downloads the component source code.
- Installs required dependencies.
- Places files in `components/ui/` (by default).
- Updates your configuration.

## Customization Best Practices

### 1. Theme Customization

Edit your Tailwind configuration and CSS variables to match your brand. shadcn-vue uses CSS variables for theming, allowing for easy updates and dark mode support.

### 2. The `cn()` Utility

shadcn-vue components often include a `cn()` helper (usually in `lib/utils.ts`) for class merging:

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Resources

Refer to the following resource files for detailed guidance:

- `resources/setup-vite.md` - Step-by-step project initialization for Vite
- `resources/setup-nuxt.md` - Step-by-step project initialization for Nuxt
- `scripts/verify-setup.sh` - Validation script for project configuration

## Examples

See the `examples/` directory for:

- `simple-button.vue` - Basic button implementation
