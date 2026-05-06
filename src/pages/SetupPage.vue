<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRouter } from 'vue-router'
import { ArrowLeft, ArrowRight, Drama, Film, Tv } from 'lucide-vue-next'
import {
  FILTERS,
  isFilterAvailableFor,
  isGameMode,
  useGameSetup,
  type ContentType,
} from '@/modules/game'

const props = defineProps<{ mode: string }>()

const { t } = useI18n()
const router = useRouter()
const setup = useGameSetup()

const normalizedMode = computed(() =>
  isGameMode(props.mode) ? props.mode : null,
)

const modeIcon = computed(() =>
  normalizedMode.value === 'actors-choice' ? Drama : Film,
)

const modeTitleKey = computed(() =>
  normalizedMode.value === 'actors-choice'
    ? 'home.modes.actorsChoice.title'
    : 'home.modes.framesChoice.title',
)

const visibleFilters = computed(() =>
  FILTERS.filter((f) => isFilterAvailableFor(f, setup.contentType.value)),
)

function pickContentType(type: ContentType) {
  setup.setContentType(type)
}

function pickFilter(id: string) {
  setup.setFilter(id)
}

function start() {
  if (!normalizedMode.value) return
  router.push({
    name: 'game',
    params: { mode: normalizedMode.value },
    query: {
      type: setup.contentType.value,
      filter: setup.filterId.value,
    },
  })
}
</script>

<template>
  <section class="setup-page">
    <div class="container setup-page__inner">
      <header class="setup-page__head">
        <RouterLink class="setup-page__back" to="/" :aria-label="t('nav.home')">
          <ArrowLeft :size="14" />
          <span class="setup-page__back-text">{{ t('nav.home') }}</span>
        </RouterLink>

        <div class="setup-page__title-block">
          <span class="setup-page__title-icon">
            <component :is="modeIcon" :size="20" :stroke-width="1.75" />
          </span>
          <h1 class="setup-page__title">{{ t(modeTitleKey) }}</h1>
        </div>

        <span class="setup-page__head-spacer" aria-hidden="true"></span>
      </header>

      <div class="setup-page__sections">
        <section class="setup-page__section">
          <h2 class="setup-page__section-title">{{ t('setup.contentType') }}</h2>
          <div class="setup-page__type-toggle" role="radiogroup">
            <button
              type="button"
              role="radio"
              :aria-checked="setup.contentType.value === 'movie'"
              class="setup-page__type-btn"
              :class="{
                'setup-page__type-btn--active': setup.contentType.value === 'movie',
              }"
              @click="pickContentType('movie')"
            >
              <Film :size="16" />
              <span>{{ t('setup.movies') }}</span>
            </button>
            <button
              type="button"
              role="radio"
              :aria-checked="setup.contentType.value === 'tv'"
              class="setup-page__type-btn"
              :class="{
                'setup-page__type-btn--active': setup.contentType.value === 'tv',
              }"
              @click="pickContentType('tv')"
            >
              <Tv :size="16" />
              <span>{{ t('setup.tvShows') }}</span>
            </button>
          </div>
        </section>

        <section class="setup-page__section">
          <h2 class="setup-page__section-title">{{ t('setup.category') }}</h2>
          <ul class="setup-page__filters">
            <li v-for="filter in visibleFilters" :key="filter.id">
              <button
                type="button"
                class="setup-page__chip"
                :class="{
                  'setup-page__chip--active': setup.filterId.value === filter.id,
                }"
                @click="pickFilter(filter.id)"
              >
                {{ t(filter.labelKey) }}
              </button>
            </li>
          </ul>
        </section>
      </div>

      <div class="setup-page__cta">
        <button type="button" class="setup-page__start-btn" @click="start">
          <span>{{ t('setup.start') }}</span>
          <ArrowRight :size="18" />
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.setup-page {
  min-height: calc(100dvh - 73px);
  display: flex;
  flex-direction: column;
  padding: var(--space-md) 0 var(--space-lg);
}

.setup-page__inner {
  max-width: 880px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: var(--space-lg);
}

/* ──────────────────  Head  ────────────────── */

.setup-page__head {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: var(--space-md);
}

.setup-page__back {
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: var(--radius-pill);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-muted);
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  transition: background-color 0.2s var(--ease-out), color 0.2s var(--ease-out),
    border-color 0.2s var(--ease-out);
}

.setup-page__back:hover {
  background-color: var(--color-bg-hover);
  color: var(--color-text);
  border-color: var(--color-border-strong);
}

.setup-page__title-block {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.setup-page__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background-color: var(--color-accent-soft);
  color: var(--color-accent);
}

.setup-page__title {
  font-family: var(--font-display);
  font-size: clamp(1.375rem, 2.5vw, 1.625rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: var(--color-text);
}

.setup-page__head-spacer {
  display: block;
}

/* ──────────────────  Sections  ────────────────── */

.setup-page__sections {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  flex: 1;
}

.setup-page__section-title {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-text-faint);
  margin-bottom: 10px;
}

/* ──────────────────  Type toggle  ────────────────── */

.setup-page__type-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 4px;
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  max-width: 380px;
}

.setup-page__type-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text-muted);
  background-color: transparent;
  transition: background-color 0.2s var(--ease-out), color 0.2s var(--ease-out),
    box-shadow 0.2s var(--ease-out);
}

.setup-page__type-btn:hover:not(.setup-page__type-btn--active) {
  color: var(--color-text);
  background-color: var(--color-bg-hover);
}

.setup-page__type-btn--active {
  background-color: var(--color-accent);
  color: var(--color-accent-text);
  box-shadow: var(--shadow-sm);
}

/* ──────────────────  Filter chips  ────────────────── */

.setup-page__filters {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}

.setup-page__chip {
  width: 100%;
  padding: 9px 10px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  text-align: center;
  white-space: nowrap;
  transition: background-color 0.2s var(--ease-out),
    border-color 0.2s var(--ease-out), color 0.2s var(--ease-out);
}

.setup-page__chip:hover:not(.setup-page__chip--active) {
  border-color: var(--color-border-strong);
  background-color: var(--color-bg-hover);
}

.setup-page__chip--active {
  background-color: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-accent-text);
  font-weight: 700;
}

/* ──────────────────  CTA  ────────────────── */

.setup-page__cta {
  display: flex;
  justify-content: center;
  padding-top: var(--space-md);
}

.setup-page__start-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 220px;
  padding: 13px 26px;
  border-radius: var(--radius-pill);
  font-size: 0.9375rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--color-accent-text);
  background-color: var(--color-accent);
  box-shadow: var(--shadow-md);
  transition: background-color 0.2s var(--ease-out), transform 0.15s var(--ease-out),
    box-shadow 0.2s var(--ease-out);
}

.setup-page__start-btn:hover {
  background-color: var(--color-accent-hover);
  box-shadow: var(--shadow-glow);
  transform: translateY(-1px);
}

.setup-page__start-btn:active {
  transform: translateY(0);
}

/* ──────────────────  Responsive  ────────────────── */

@media (max-width: 900px) {
  .setup-page__filters {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 700px) {
  .setup-page__back-text {
    display: none;
  }

  .setup-page__title {
    font-size: 1.25rem;
  }

  .setup-page__filters {
    grid-template-columns: repeat(3, 1fr);
  }

  .setup-page__chip {
    font-size: 0.8125rem;
    padding: 8px 8px;
  }

  .setup-page__type-toggle {
    max-width: none;
  }
}

@media (max-width: 440px) {
  .setup-page__filters {
    grid-template-columns: repeat(2, 1fr);
  }

  .setup-page__start-btn {
    width: 100%;
    min-width: 0;
  }
}
</style>
