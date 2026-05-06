<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Flag,
  Loader2,
  RefreshCw,
  Trophy,
  X,
} from 'lucide-vue-next'
import { useFramesChoiceGame } from '@/modules/game'
import type { TmdbMovie } from '../models'

const { t } = useI18n()
const game = useFramesChoiceGame()

const progressPercent = computed(() => {
  if (game.rounds.value.length === 0) return 0
  return ((game.currentIndex.value + 1) / game.rounds.value.length) * 100
})

function optionClass(option: TmdbMovie): string {
  if (!game.isAnswered.value) return 'frames-game__option'
  if (game.current.value && option.id === game.current.value.movie.id) {
    return 'frames-game__option frames-game__option--correct'
  }
  if (option.id === game.selectedId.value) {
    return 'frames-game__option frames-game__option--wrong'
  }
  return 'frames-game__option frames-game__option--dim'
}

onMounted(game.buildRounds)
</script>

<template>
  <div class="frames-game">
    <div v-if="game.isLoading.value" class="frames-game__state">
      <Loader2 :size="32" class="frames-game__spinner" />
      <span>{{ t('game.loading') }}</span>
    </div>

    <div
      v-else-if="game.errorMessage.value"
      class="frames-game__state frames-game__state--error"
    >
      {{ game.errorMessage.value }}
    </div>

    <div v-else-if="game.isFinished.value" class="frames-game__finish">
      <span class="frames-game__finish-icon">
        <Trophy :size="40" :stroke-width="1.5" />
      </span>
      <h2 class="frames-game__finish-title">
        <span class="frames-game__finish-score">{{ game.score.value }}</span>
        <span class="frames-game__finish-of">/ {{ game.rounds.value.length }}</span>
      </h2>
      <p class="frames-game__finish-sub">{{ t('game.score') }}</p>
      <button type="button" class="frames-game__btn" @click="game.restart">
        <RefreshCw :size="16" />
        {{ t('home.play') }}
      </button>
    </div>

    <div v-else-if="game.current.value" class="frames-game__round">
      <!-- LEFT: image column -->
      <div
        class="frames-game__image-col"
        :style="{ backgroundImage: `url(${game.current.value.imageUrl})` }"
      >
        <img
          :key="game.current.value.movie.id"
          class="frames-game__image"
          :src="game.current.value.imageUrl"
          :alt="t('game.round')"
        />
      </div>

      <!-- RIGHT: info column -->
      <aside class="frames-game__info-col">
        <header class="frames-game__head">
          <RouterLink class="frames-game__back" to="/" :aria-label="t('nav.home')">
            <ArrowLeft :size="14" />
            <span>{{ t('nav.home') }}</span>
          </RouterLink>

          <div class="frames-game__score-pill">
            <Trophy :size="13" />
            <span>{{ game.score.value }}</span>
          </div>
        </header>

        <div class="frames-game__progress">
          <div class="frames-game__progress-meta">
            <span>{{ t('game.round') }}</span>
            <span>{{ game.currentIndex.value + 1 }} / {{ game.rounds.value.length }}</span>
          </div>
          <div class="frames-game__progress-track">
            <div
              class="frames-game__progress-bar"
              :style="{ width: progressPercent + '%' }"
            ></div>
          </div>
        </div>

        <div class="frames-game__prompt">
          <span class="frames-game__prompt-eyebrow">{{ t('game.round') }} {{ game.currentIndex.value + 1 }}</span>
          <h2 class="frames-game__prompt-title">
            {{ game.contentType.value === 'tv' ? t('game.prompt.framesTv') : t('game.prompt.framesMovie') }}
          </h2>
        </div>

        <ul class="frames-game__options">
          <li v-for="(option, idx) in game.current.value.options" :key="option.id">
            <button
              type="button"
              :class="optionClass(option)"
              :disabled="game.isAnswered.value"
              @click="game.answer(option)"
            >
              <span class="frames-game__option-index">{{ idx + 1 }}</span>
              <span class="frames-game__option-text">{{ option.title }}</span>
            </button>
          </li>
        </ul>

        <Transition name="slide-up">
          <div v-if="game.isAnswered.value" class="frames-game__feedback">
            <span
              v-if="game.selectedId.value === game.current.value.movie.id"
              class="frames-game__feedback-text frames-game__feedback-text--correct"
            >
              <Check :size="16" />
              {{ t('game.correct') }}
            </span>
            <span
              v-else
              class="frames-game__feedback-text frames-game__feedback-text--wrong"
            >
              <X :size="16" />
              <span class="frames-game__feedback-answer">
                <strong>{{ game.current.value.movie.title }}</strong>
              </span>
            </span>
            <button type="button" class="frames-game__btn" @click="game.next">
              {{ game.isLastRound.value ? t('game.finish') : t('game.next') }}
              <component :is="game.isLastRound.value ? Flag : ArrowRight" :size="16" />
            </button>
          </div>
        </Transition>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.frames-game {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: var(--space-md);
}

.frames-game__round {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(360px, 1fr);
  gap: var(--space-lg);
  flex: 1;
  min-height: 0;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* ──────────────────  Image column  ────────────────── */

.frames-game__image-col {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  min-width: 0;
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background-color: #000;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  isolation: isolate;
}

.frames-game__image-col::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: inherit;
  background-size: cover;
  background-position: center;
  filter: blur(40px) saturate(140%);
  transform: scale(1.15);
  opacity: 0.5;
  z-index: -2;
}

.frames-game__image-col::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 30%,
    rgba(0, 0, 0, 0.55) 100%
  );
  z-index: -1;
}

.frames-game__image {
  display: block;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  border-radius: var(--radius-md);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  animation: image-in 0.45s var(--ease-out) both;
  z-index: 1;
}

@keyframes image-in {
  from {
    opacity: 0;
    transform: scale(1.03);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ──────────────────  Info column  ────────────────── */

.frames-game__info-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  min-height: 0;
}

.frames-game__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
}

.frames-game__back {
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

.frames-game__back:hover {
  background-color: var(--color-bg-hover);
  color: var(--color-text);
  border-color: var(--color-border-strong);
}

.frames-game__score-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: var(--color-accent-soft);
  color: var(--color-accent);
  border-radius: var(--radius-pill);
  font-weight: 700;
  font-size: 0.8125rem;
}

/* ──────────────────  Progress  ────────────────── */

.frames-game__progress {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.frames-game__progress-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-faint);
}

.frames-game__progress-track {
  height: 4px;
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  overflow: hidden;
}

.frames-game__progress-bar {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--color-accent) 0%,
    var(--color-burgundy) 100%
  );
  border-radius: var(--radius-pill);
  transition: width 0.4s var(--ease-out);
}

/* ──────────────────  Prompt  ────────────────── */

.frames-game__prompt {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: var(--space-xs);
}

.frames-game__prompt-eyebrow {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-faint);
}

.frames-game__prompt-title {
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 2vw, 1.75rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: var(--color-text);
}

/* ──────────────────  Options  ────────────────── */

.frames-game__options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.frames-game__option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text);
  text-align: left;
  transition: background-color 0.2s var(--ease-out),
    border-color 0.2s var(--ease-out), opacity 0.2s var(--ease-out),
    transform 0.15s var(--ease-out);
}

.frames-game__option-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background-color: var(--color-bg-hover);
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
  transition: background-color 0.2s var(--ease-out), color 0.2s var(--ease-out);
}

.frames-game__option-text {
  flex: 1;
  min-width: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
}

.frames-game__option:hover:not(:disabled) {
  border-color: var(--color-accent);
  background-color: var(--color-bg-hover);
}

.frames-game__option:hover:not(:disabled) .frames-game__option-index {
  background-color: var(--color-accent-soft);
  color: var(--color-accent);
}

.frames-game__option:disabled {
  cursor: default;
}

.frames-game__option--correct {
  background-color: var(--color-success);
  border-color: var(--color-success);
  color: #fff;
}

.frames-game__option--correct .frames-game__option-index {
  background-color: rgba(255, 255, 255, 0.25);
  color: #fff;
}

.frames-game__option--wrong {
  background-color: var(--color-danger);
  border-color: var(--color-danger);
  color: #fff;
}

.frames-game__option--wrong .frames-game__option-index {
  background-color: rgba(255, 255, 255, 0.25);
  color: #fff;
}

.frames-game__option--dim {
  opacity: 0.45;
}

/* ──────────────────  Feedback  ────────────────── */

.frames-game__feedback {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 14px;
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-top: auto;
}

.frames-game__feedback-text {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  min-width: 0;
}

.frames-game__feedback-text--correct {
  color: var(--color-success);
  font-weight: 700;
}

.frames-game__feedback-text--wrong {
  color: var(--color-danger);
}

.frames-game__feedback-answer strong {
  color: var(--color-text);
  font-weight: 700;
}

.frames-game__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: var(--radius-pill);
  background-color: var(--color-accent);
  color: var(--color-accent-text);
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: -0.01em;
  transition: background-color 0.2s var(--ease-out),
    box-shadow 0.2s var(--ease-out);
}

.frames-game__btn:hover {
  background-color: var(--color-accent-hover);
  box-shadow: var(--shadow-glow);
}

/* ──────────────────  States  ────────────────── */

.frames-game__state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  text-align: center;
  flex: 1;
  color: var(--color-text-muted);
  font-weight: 500;
}

.frames-game__state--error {
  color: var(--color-danger);
}

.frames-game__spinner {
  color: var(--color-accent);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.frames-game__finish {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  text-align: center;
  padding: var(--space-2xl) var(--space-xl);
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  margin: auto;
  width: min(440px, 100%);
}

.frames-game__finish-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--color-accent-soft);
  color: var(--color-accent);
  margin-bottom: var(--space-sm);
}

.frames-game__finish-title {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 4.5rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1;
}

.frames-game__finish-score {
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-burgundy) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.frames-game__finish-of {
  color: var(--color-text-faint);
  font-size: 0.5em;
  font-weight: 700;
}

.frames-game__finish-sub {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: var(--space-md);
}

/* ──────────────────  Transitions  ────────────────── */

.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.25s var(--ease-out), transform 0.25s var(--ease-out);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* ──────────────────  Responsive  ────────────────── */

@media (max-width: 1024px) {
  .frames-game__round {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(0, 1fr) auto;
    max-width: 900px;
  }

  .frames-game__info-col {
    position: relative;
    gap: var(--space-sm);
    padding-bottom: 110px;
  }

  .frames-game__options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .frames-game__prompt {
    display: none;
  }

  .frames-game__feedback {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    margin-top: 0;
  }
}

@media (max-width: 540px) {
  .frames-game {
    padding: var(--space-sm);
  }

  .frames-game__options {
    grid-template-columns: 1fr;
  }

  .frames-game__info-col {
    padding-bottom: 130px;
  }

  .frames-game__feedback {
    padding: 10px 12px;
  }
}
</style>
