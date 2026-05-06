<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { ArrowRight, Lock } from 'lucide-vue-next'
import type { ModeCard } from '../models/mode-card.types'

defineProps<{ card: ModeCard }>()

const { t } = useI18n()
</script>

<template>
  <RouterLink
    v-if="card.available"
    class="mode-card mode-card--clickable"
    :to="{ name: 'setup', params: { mode: card.mode } }"
  >
    <div class="mode-card__bg" aria-hidden="true"></div>

    <span class="mode-card__icon">
      <component :is="card.icon" :size="28" :stroke-width="1.75" />
    </span>

    <h3 class="mode-card__title">{{ t(card.titleKey) }}</h3>
    <p class="mode-card__description">{{ t(card.descriptionKey) }}</p>

    <span class="mode-card__cta">
      <span>{{ t('home.play') }}</span>
      <ArrowRight :size="16" class="mode-card__cta-arrow" />
    </span>
  </RouterLink>

  <div v-else class="mode-card mode-card--disabled">
    <span class="mode-card__icon">
      <component :is="card.icon" :size="28" :stroke-width="1.75" />
    </span>

    <h3 class="mode-card__title">{{ t(card.titleKey) }}</h3>
    <p class="mode-card__description">{{ t(card.descriptionKey) }}</p>

    <span class="mode-card__soon">
      <Lock :size="11" />
      {{ t('home.soon') }}
    </span>
  </div>
</template>

<style scoped>
.mode-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: var(--space-xl);
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: border-color 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out);
  isolation: isolate;
  overflow: hidden;
}

.mode-card__bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at top right,
    var(--color-accent-soft) 0%,
    transparent 60%
  );
  opacity: 0.6;
  pointer-events: none;
  z-index: -1;
  transition: opacity 0.3s var(--ease-out);
}

.mode-card--clickable:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-md);
}

.mode-card--clickable:hover .mode-card__bg {
  opacity: 1;
}

.mode-card--disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.mode-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin-bottom: var(--space-lg);
  border-radius: 16px;
  background-color: var(--color-accent-soft);
  color: var(--color-accent);
  transition: transform 0.4s var(--ease-out), background-color 0.3s var(--ease-out);
}

.mode-card--clickable:hover .mode-card__icon {
  transform: scale(1.06) rotate(-3deg);
  background-color: var(--color-accent);
  color: var(--color-accent-text);
}

.mode-card__title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin-bottom: 8px;
  color: var(--color-text);
}

.mode-card__description {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  flex: 1;
  margin-bottom: var(--space-lg);
}

.mode-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  padding: 10px 18px;
  border-radius: var(--radius-pill);
  background-color: var(--color-accent);
  color: var(--color-accent-text);
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  transition: background-color 0.2s var(--ease-out),
    box-shadow 0.2s var(--ease-out);
}

.mode-card--clickable:hover .mode-card__cta {
  background-color: var(--color-accent-hover);
  box-shadow: var(--shadow-glow);
}

.mode-card__cta-arrow {
  transition: transform 0.3s var(--ease-out);
}

.mode-card--clickable:hover .mode-card__cta-arrow {
  transform: translateX(4px);
}

.mode-card__soon {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  align-self: flex-start;
  padding: 4px 10px;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background-color: var(--color-bg-hover);
  color: var(--color-text-muted);
  border-radius: var(--radius-pill);
}

@media (max-width: 700px) {
  .mode-card {
    padding: var(--space-lg);
  }

  .mode-card__title {
    font-size: 1.25rem;
  }
}
</style>
