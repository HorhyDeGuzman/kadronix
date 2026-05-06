<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Sparkles } from 'lucide-vue-next'

const { t } = useI18n()
</script>

<template>
  <div class="main-hero">
    <div class="main-hero__bg" aria-hidden="true"></div>

    <div class="container main-hero__content">
      <div class="main-hero__eyebrow">
        <Sparkles :size="14" />
        <span>{{ t('app.tagline') }}</span>
      </div>

      <h1 class="main-hero__heading">
        <span class="main-hero__heading-accent">{{ t('app.title') }}</span>
      </h1>

      <p class="main-hero__lead">{{ t('home.description') }}</p>
    </div>
  </div>
</template>

<style scoped>
.main-hero {
  position: relative;
  padding: var(--space-2xl) 0 var(--space-lg);
  text-align: center;
}

.main-hero__bg {
  position: absolute;
  inset: 0;
  background: var(--gradient-hero);
  pointer-events: none;
  z-index: 0;
  -webkit-mask-image: radial-gradient(ellipse at center, #000 40%, transparent 80%);
  mask-image: radial-gradient(ellipse at center, #000 40%, transparent 80%);
}

.main-hero__content {
  position: relative;
  z-index: 1;
}

.main-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  margin-bottom: var(--space-lg);
  border-radius: var(--radius-pill);
  background-color: var(--color-accent-soft);
  color: var(--color-accent);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.main-hero__heading {
  font-family: var(--font-display);
  font-size: clamp(3rem, 9vw, 6rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1;
  margin-bottom: var(--space-lg);
}

.main-hero__heading-accent {
  background: linear-gradient(
    135deg,
    var(--color-text) 0%,
    var(--color-accent) 60%,
    var(--color-burgundy) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 4px 30px var(--color-accent-soft));
}

.main-hero__lead {
  max-width: 520px;
  margin: 0 auto;
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--color-text-muted);
  line-height: 1.55;
}
</style>
