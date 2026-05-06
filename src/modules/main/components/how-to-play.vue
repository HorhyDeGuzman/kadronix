<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Clapperboard, Sliders, Trophy } from 'lucide-vue-next'

const { t } = useI18n()

const steps = [
  { num: '01', icon: Clapperboard, key: 'pickMode' },
  { num: '02', icon: Sliders, key: 'pickFilter' },
  { num: '03', icon: Trophy, key: 'guess' },
] as const
</script>

<template>
  <section class="how-to-play">
    <header class="how-to-play__header">
      <span class="how-to-play__label">{{ t('home.howItWorks') }}</span>
    </header>

    <ol class="how-to-play__steps">
      <li v-for="step in steps" :key="step.key" class="how-to-play__step">
        <span class="how-to-play__num">{{ step.num }}</span>
        <span class="how-to-play__icon">
          <component :is="step.icon" :size="22" :stroke-width="1.75" />
        </span>
        <h3 class="how-to-play__title">
          {{ t(`home.steps.${step.key}.title`) }}
        </h3>
        <p class="how-to-play__desc">
          {{ t(`home.steps.${step.key}.desc`) }}
        </p>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.how-to-play {
  padding: var(--space-lg) 0;
}

.how-to-play__header {
  margin-bottom: var(--space-md);
}

.how-to-play__label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-text-faint);
}

.how-to-play__steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}

.how-to-play__step {
  position: relative;
  padding: var(--space-lg);
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: border-color 0.2s var(--ease-out);
}

.how-to-play__step:hover {
  border-color: var(--color-border-strong);
}

.how-to-play__num {
  position: absolute;
  top: var(--space-lg);
  right: var(--space-lg);
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: var(--color-text-faint);
}

.how-to-play__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-bottom: var(--space-md);
  border-radius: 12px;
  background-color: var(--color-accent-soft);
  color: var(--color-accent);
}

.how-to-play__title {
  font-family: var(--font-display);
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-bottom: 4px;
  color: var(--color-text);
}

.how-to-play__desc {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.45;
}

@media (max-width: 700px) {
  .how-to-play__steps {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }

  .how-to-play__step {
    padding: var(--space-md);
  }
}
</style>
