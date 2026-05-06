<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { MODE_CARDS } from '../consts/mode-cards'
import ModeCard from './mode-card.vue'

const { t } = useI18n()
</script>

<template>
  <section class="modes-grid">
    <header class="modes-grid__header">
      <h2 class="modes-grid__heading">{{ t('home.chooseMode') }}</h2>
    </header>

    <ul class="modes-grid__list">
      <li v-for="card in MODE_CARDS" :key="card.mode" class="modes-grid__item">
        <ModeCard :card="card" />
      </li>
    </ul>
  </section>
</template>

<style scoped>
.modes-grid__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  margin-bottom: var(--space-lg);
}

.modes-grid__label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-faint);
}

.modes-grid__heading {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.modes-grid__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-md);
}

.modes-grid__item {
  display: flex;
}
</style>
