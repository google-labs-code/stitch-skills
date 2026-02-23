# Vite Setup with shadcn-vue (Yarn)

Follow these steps to set up `shadcn-vue` in a Vite project using `yarn`.

## 1. Create Project

```bash
yarn create vite@latest my-vue-app --template vue-ts
cd my-vue-app
```

## 2. Add Tailwind CSS

```bash
yarn add tailwindcss @tailwindcss/vite
```

## 3. Configure Tailwind CSS

In `src/style.css`, replace the content with:

```css
@import "tailwindcss";
```

## 4. Configure Framework Aliases

#### Edit `tsconfig.json` and `tsconfig.app.json`
Add the following paths to your compiler options:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### Update `vite.config.ts`

```typescript
import path from 'node:path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

## 5. Run the CLI Initialization

```bash
yarn dlx shadcn-vue@latest init
```

## 6. Add Components

```bash
yarn dlx shadcn-vue@latest add [component-name]
```
