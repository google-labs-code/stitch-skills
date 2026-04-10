<template>
  <div :class="['relative', props.class]">
    <slot />
  </div>
</template>

<script setup lang="ts">
// Use a valid identifier like 'StitchComponent' as the placeholder.
// Replace ALL occurrences of 'StitchComponent' with the actual component name.

interface StitchComponentProps {
  class?: string;
}

const props = withDefaults(defineProps<StitchComponentProps>(), {
  class: "",
});
</script>
