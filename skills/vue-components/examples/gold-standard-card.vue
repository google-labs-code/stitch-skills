<script setup lang="ts">
// Note for Agent: The '@' alias refers to the target project's src directory.
// Ensure src/data/mockData.ts is created before generating this component.
import { computed } from 'vue'
import { cardData } from '@/data/mockData'

/**
 * Gold Standard: ActivityCard
 * This file serves as the definitive reference for the agent.
 */
interface ActivityCardProps {
  id: string
  username: string
  action: 'MERGED' | 'COMMIT'
  timestamp: string
  avatarUrl: string
  repoName: string
}

const props = defineProps<ActivityCardProps>()

const isMerged = computed(() => props.action === 'MERGED')
</script>

<template>
  <div class="flex items-center justify-between gap-4 rounded-lg bg-surface-dark p-4 min-h-14 shadow-sm ring-1 ring-white/10">
    <div class="flex items-center gap-4 overflow-hidden">
      <div
        class="aspect-square h-10 w-10 flex-shrink-0 rounded-full bg-cover bg-center bg-no-repeat"
        :style="{ backgroundImage: `url(${props.avatarUrl})` }"
        :aria-label="`Avatar for ${props.username}`"
      />

      <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm sm:text-base">
        <a href="#" class="font-semibold text-primary hover:underline truncate">
          {{ props.username }}
        </a>

        <span
          :class="[
            'inline-block px-2 py-0.5 text-xs font-semibold rounded-full',
            isMerged ? 'bg-purple-500/30 text-purple-300' : 'bg-primary/30 text-primary',
          ]"
        >
          {{ props.action }}
        </span>

        <span class="text-white/60">in</span>

        <a href="#" class="text-primary hover:underline truncate">
          {{ props.repoName }}
        </a>
      </div>
    </div>

    <div class="shrink-0">
      <p class="text-sm font-normal leading-normal text-white/50">
        {{ props.timestamp }}
      </p>
    </div>
  </div>
</template>
