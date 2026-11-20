# Nuxt Setup with shadcn-vue (Yarn)

Follow these steps to set up `shadcn-vue` in a Nuxt project using `yarn`.

## 1. Create Project

```bash
yarn create nuxt@latest my-nuxt-app
cd my-nuxt-app
```

## 2. Add Tailwind CSS

```bash
yarn add tailwindcss @tailwindcss/vite -D
```

## 3. Configure Tailwind CSS in Nuxt

#### Create `assets/css/tailwind.css`
Add the following line:

```css
@import "tailwindcss";
```

#### Update `nuxt.config.ts`

```typescript
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
```

## 4. Add Nuxt Module

```bash
yarn dlx nuxi@latest module add shadcn-nuxt
```

## 5. Add SSR Width Plugin (Optional)

To avoid hydration errors on mobile, create `app/plugins/ssr-width.ts`:

```typescript
import { provideSSRWidth } from '@vueuse/core'

export default defineNuxtPlugin((nuxtApp) => {
  provideSSRWidth(1024, nuxtApp.vueApp)
})
```

## 6. Run Nuxt Prepare

```bash
yarn dlx nuxi prepare
```

## 7. Run the CLI Initialization

```bash
yarn dlx shadcn-vue@latest init
```

## 8. Add Components

```bash
yarn dlx shadcn-vue@latest add [component-name]
```
