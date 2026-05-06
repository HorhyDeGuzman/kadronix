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
import { useActorsChoiceGame } from '@/modules/game'
import { buildTmdbImageUrl } from '@/core/api/tmdb-client'
import type { TmdbMovie } from '../models'

const { t } = useI18n()
const game = useActorsChoiceGame()

const progressPercent = computed(() => {
  if (game.rounds.value.length === 0) return 0
  return ((game.currentIndex.value + 1) / game.rounds.value.length) * 100
})

function actorPhoto(path: string | null) {
  return buildTmdbImageUrl(path, 'w342')
}

function optionClass(option: TmdbMovie): string {
  if (!game.isAnswered.value) return 'actors-game__option'
  if (game.current.value && option.id === game.current.value.movie.id) {
    return 'actors-game__option actors-game__option--correct'
  }
  if (option.id === game.selectedId.value) {
    return 'actors-game__option actors-game__option--wrong'
  }
  return 'actors-game__option actors-game__option--dim'
}

const isCorrect = computed(
  () =>
    !!game.current.value &&
    game.selectedId.value === game.current.value.movie.id,
)

onMounted(game.buildRounds)
</script>

<template>
  <div class="actors-game">
    <!-- TOPBAR -->
    <header class="actors-game__topbar">
      <RouterLink class="actors-game__back" to="/" :aria-label="t('nav.home')">
        <ArrowLeft :size="14" />
        <span class="actors-game__back-text">{{ t('nav.home') }}</span>
      </RouterLink>

      <div v-if="game.rounds.value.length > 0" class="actors-game__progress">
        <span class="actors-game__round-label">
          {{ game.currentIndex.value + 1 }} / {{ game.rounds.value.length }}
        </span>
        <div class="actors-game__progress-track">
          <div
            class="actors-game__progress-bar"
            :style="{ width: progressPercent + '%' }"
          ></div>
        </div>
      </div>

      <div class="actors-game__score-pill">
        <Trophy :size="14" />
        <span>{{ game.score.value }}</span>
      </div>
    </header>

    <!-- BODY -->
    <div class="actors-game__body">
      <div v-if="game.isLoading.value" class="actors-game__state">
        <Loader2 :size="32" class="actors-game__spinner" />
        <span>{{ t('game.loading') }}</span>
      </div>

      <div
        v-else-if="game.errorMessage.value"
        class="actors-game__state actors-game__state--error"
      >
        {{ game.errorMessage.value }}
      </div>

      <div v-else-if="game.isFinished.value" class="actors-game__finish">
        <span class="actors-game__finish-icon">
          <Trophy :size="40" :stroke-width="1.5" />
        </span>
        <h2 class="actors-game__finish-title">
          <span class="actors-game__finish-score">{{ game.score.value }}</span>
          <span class="actors-game__finish-of">/ {{ game.rounds.value.length }}</span>
        </h2>
        <p class="actors-game__finish-sub">{{ t('game.score') }}</p>
        <button type="button" class="actors-game__btn" @click="game.restart">
          <RefreshCw :size="16" />
          {{ t('home.play') }}
        </button>
      </div>

      <div v-else-if="game.current.value" class="actors-game__round">
        <!-- CAST: compact row at top -->
        <ul :key="game.current.value.movie.id" class="actors-game__cast">
          <li
            v-for="actor in game.current.value.cast"
            :key="actor.id"
            class="actors-game__actor"
          >
            <div class="actors-game__actor-photo-wrap">
              <img
                v-if="actorPhoto(actor.profile_path)"
                class="actors-game__actor-photo"
                :src="actorPhoto(actor.profile_path)!"
                :alt="actor.name"
              />
            </div>
            <p class="actors-game__actor-name">{{ actor.name }}</p>
          </li>
        </ul>

        <!-- Prompt: same plain text in all states, button reserves its slot -->
        <div class="actors-game__prompt">
          <Transition name="fade" mode="out-in">
            <h2
              v-if="!game.isAnswered.value"
              key="question"
              class="actors-game__prompt-title"
            >
              {{
                game.contentType.value === 'tv'
                  ? t('game.prompt.actorsTv')
                  : t('game.prompt.actorsMovie')
              }}
            </h2>
            <h2
              v-else-if="isCorrect"
              key="correct"
              class="actors-game__prompt-title actors-game__prompt-title--correct"
            >
              <Check :size="26" />
              <span>{{ t('game.correct') }}</span>
            </h2>
            <h2
              v-else
              key="wrong"
              class="actors-game__prompt-title actors-game__prompt-title--wrong"
            >
              <X :size="26" />
              <span>{{ game.current.value.movie.title }}</span>
            </h2>
          </Transition>

          <button
            type="button"
            class="actors-game__btn actors-game__next-btn"
            :class="{ 'actors-game__next-btn--hidden': !game.isAnswered.value }"
            :tabindex="game.isAnswered.value ? 0 : -1"
            :aria-hidden="!game.isAnswered.value"
            @click="game.next"
          >
            {{ game.isLastRound.value ? t('game.finish') : t('game.next') }}
            <component
              :is="game.isLastRound.value ? Flag : ArrowRight"
              :size="16"
            />
          </button>
        </div>

        <!-- BIG 2x2 options grid -->
        <ul class="actors-game__options">
          <li v-for="(option, idx) in game.current.value.options" :key="option.id">
            <button
              type="button"
              :class="optionClass(option)"
              :disabled="game.isAnswered.value"
              @click="game.answer(option)"
            >
              <span class="actors-game__option-index">{{ idx + 1 }}</span>
              <span class="actors-game__option-text">{{ option.title }}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.actors-game {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

/* ──────────────────  Topbar  ────────────────── */

.actors-game__topbar {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: 12px var(--space-lg);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-bg);
  flex-shrink: 0;
}

.actors-game__back {
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

.actors-game__back:hover {
  background-color: var(--color-bg-hover);
  color: var(--color-text);
  border-color: var(--color-border-strong);
}

.actors-game__progress {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  min-width: 0;
}

.actors-game__round-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-faint);
  white-space: nowrap;
}

.actors-game__progress-track {
  flex: 1;
  height: 4px;
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  overflow: hidden;
}

.actors-game__progress-bar {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--color-accent) 0%,
    var(--color-burgundy) 100%
  );
  border-radius: var(--radius-pill);
  transition: width 0.4s var(--ease-out);
}

.actors-game__score-pill {
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

/* ──────────────────  Body / Round layout  ────────────────── */

.actors-game__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--space-lg);
  min-height: 0;
  overflow-y: auto;
}

.actors-game__round {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
}

/* ──────────────────  Cast strip  ────────────────── */

.actors-game__cast {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xl);
  justify-items: center;
}

.actors-game__actor {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 300px;
  animation: actor-in 0.5s var(--ease-out) both;
}

.actors-game__actor:nth-child(2) {
  animation-delay: 0.08s;
}

.actors-game__actor:nth-child(3) {
  animation-delay: 0.16s;
}

@keyframes actor-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.actors-game__actor-photo-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1.3;
  border-radius: 10%;
  overflow: hidden;
  background-color: var(--color-bg-elevated);
  border: 3px solid var(--color-accent-soft);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5),
    0 0 0 1px var(--color-border);
}

.actors-game__actor-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 18%;
}

.actors-game__actor-name {
  font-family: var(--font-display);
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--color-text);
  line-height: 1.25;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ──────────────────  Prompt  ────────────────── */

.actors-game__prompt {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-sm) 0 64px;
}

.actors-game__prompt-title {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  min-height: 56px;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2.125rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: var(--color-text);
  text-align: center;
  flex-wrap: wrap;
}

.actors-game__prompt-title--correct {
  color: var(--color-success);
}

.actors-game__prompt-title--wrong > svg {
  color: var(--color-danger);
  flex-shrink: 0;
}

.actors-game__next-btn {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  transition: opacity 0.2s var(--ease-out), background-color 0.2s var(--ease-out),
    box-shadow 0.2s var(--ease-out);
}

.actors-game__next-btn--hidden {
  opacity: 0;
  pointer-events: none;
}

/* ──────────────────  Big options  ────────────────── */

.actors-game__options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
}

.actors-game__option {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  width: 100%;
  height: 100%;
  min-height: 80px;
  padding: var(--space-md) var(--space-lg);
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  text-align: left;
  transition: background-color 0.2s var(--ease-out),
    border-color 0.2s var(--ease-out), opacity 0.2s var(--ease-out),
    transform 0.15s var(--ease-out);
}

.actors-game__option-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background-color: var(--color-bg-hover);
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 800;
  flex-shrink: 0;
  transition: background-color 0.2s var(--ease-out), color 0.2s var(--ease-out);
}

.actors-game__option-text {
  flex: 1;
  min-width: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
}

.actors-game__option:hover:not(:disabled) {
  border-color: var(--color-accent);
  background-color: var(--color-bg-hover);
}

.actors-game__option:hover:not(:disabled) .actors-game__option-index {
  background-color: var(--color-accent-soft);
  color: var(--color-accent);
}

.actors-game__option:disabled {
  cursor: default;
}

.actors-game__option--correct {
  background-color: var(--color-success);
  border-color: var(--color-success);
  color: #fff;
}

.actors-game__option--correct .actors-game__option-index {
  background-color: rgba(255, 255, 255, 0.25);
  color: #fff;
}

.actors-game__option--wrong {
  background-color: var(--color-danger);
  border-color: var(--color-danger);
  color: #fff;
}

.actors-game__option--wrong .actors-game__option-index {
  background-color: rgba(255, 255, 255, 0.25);
  color: #fff;
}

.actors-game__option--dim {
  opacity: 0.4;
}

/* ──────────────────  Button  ────────────────── */

.actors-game__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 22px;
  border-radius: var(--radius-pill);
  background-color: var(--color-accent);
  color: var(--color-accent-text);
  font-weight: 700;
  font-size: 0.9375rem;
  letter-spacing: -0.01em;
  flex-shrink: 0;
  transition: background-color 0.2s var(--ease-out),
    box-shadow 0.2s var(--ease-out);
}

.actors-game__btn:hover {
  background-color: var(--color-accent-hover);
  box-shadow: var(--shadow-glow);
}

/* ──────────────────  States  ────────────────── */

.actors-game__state {
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

.actors-game__state--error {
  color: var(--color-danger);
}

.actors-game__spinner {
  color: var(--color-accent);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.actors-game__finish {
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

.actors-game__finish-icon {
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

.actors-game__finish-title {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 4.5rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1;
}

.actors-game__finish-score {
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-burgundy) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.actors-game__finish-of {
  color: var(--color-text-faint);
  font-size: 0.5em;
  font-weight: 700;
}

.actors-game__finish-sub {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: var(--space-md);
}

/* ──────────────────  Transitions  ────────────────── */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s var(--ease-out);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ──────────────────  Responsive  ────────────────── */

@media (max-width: 700px) {
  .actors-game__body {
    padding: var(--space-md);
    height: 100%;
  }

  .actors-game__round {
    gap: var(--space-md);
    height: 100%;
  }

  .actors-game__cast {
    gap: var(--space-md);
  }

  .actors-game__actor {
    gap: 10px;
  }

  .actors-game__actor-name {
    font-size: 0.875rem;
  }

  .actors-game__back-text {
    display: none;
  }

  .actors-game__option {
    min-height: 56px;
    padding: 10px 12px;
    font-size: 0.9375rem;
  }

  .actors-game__option-index {
    width: 26px;
    height: 26px;
    font-size: 0.75rem;
  }

  .actors-game__prompt {
    padding: 0 0 56px;
  }

  .actors-game__prompt-title {
    font-size: 1.25rem;
    min-height: 48px;
  }
}

@media (max-width: 480px) {
  .actors-game__cast {
    gap: 10px;
  }

  .actors-game__actor-name {
    font-size: 0.8125rem;
  }

  .actors-game__prompt {
    padding: 0 0 60px;
    margin-bottom: auto;
  }

  .actors-game__prompt-title {
    font-size: 1.125rem;
    min-height: 56px;
    gap: 8px;
  }

  .actors-game__options {
    grid-template-columns: 1fr;
    margin-top: auto;
  }

  .actors-game__next-btn {
    width: calc(100% - var(--space-md));
    max-width: 360px;
  }
}
</style>
