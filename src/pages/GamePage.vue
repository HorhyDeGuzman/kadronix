<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  ActorsChoiceGame,
  FramesChoiceGame,
  isGameMode,
  type GameMode,
} from '@/modules/game'

const props = defineProps<{ mode: string }>()

const { t } = useI18n()

const normalizedMode = computed<GameMode | null>(() =>
  isGameMode(props.mode) ? props.mode : null,
)
</script>

<template>
  <section class="game-page">
    <FramesChoiceGame v-if="normalizedMode === 'frames-choice'" />
    <ActorsChoiceGame v-else-if="normalizedMode === 'actors-choice'" />

    <div v-else class="game-page__not-found">
      <p class="game-page__not-found-text">
        {{ t('game.error') }}
      </p>
      <RouterLink class="game-page__not-found-link" to="/">
        ← {{ t('nav.home') }}
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.game-page {
  height: calc(100dvh - 73px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.game-page__not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  flex: 1;
  text-align: center;
  color: var(--color-text-muted);
}

.game-page__not-found-link {
  font-weight: 600;
  color: var(--color-accent);
}

.game-page__not-found-link:hover {
  color: var(--color-accent-hover);
}
</style>
