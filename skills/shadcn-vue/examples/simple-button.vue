<script setup lang="ts">
import { Button } from "@/components/ui/button";
</script>

<template>
  <div class="flex flex-col items-center justify-center p-8 gap-4">
    <h1 class="text-2xl font-bold">Hello from shadcn-vue!</h1>
    <Button>Click Me</Button>
    <Button variant="outline">Outline Button</Button>
    <Button variant="ghost">Ghost Button</Button>
  </div>
</template>
