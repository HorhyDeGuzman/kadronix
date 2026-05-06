import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { buildTmdbImageUrl } from '@/core/api/tmdb-client'
import { TMDB_LANGUAGE_BY_LOCALE, type Locale } from '@/common/i18n'
import { useLocaleStore } from '@/common/store/locale.store'
import { OPTIONS_PER_ROUND, TOTAL_ROUNDS } from '../consts/game'
import { DEFAULT_FILTER_ID } from '../consts/filters'
import { pickRandom, shuffle } from '../helpers/shuffle'
import type { FramesChoiceRound, TmdbMovie } from '../models'
import { isContentType, type ContentType } from '../models/setup.types'
import { getContentImages } from '../services/tmdb-api'
import { loadMoviePool } from '../services/movie-pool.service'

export function useFramesChoiceGame() {
  const { t } = useI18n()
  const localeStore = useLocaleStore()
  const route = useRoute()

  const rounds = ref<FramesChoiceRound[]>([])
  const currentIndex = ref(0)
  const score = ref(0)
  const selectedId = ref<number | null>(null)
  const isLoading = ref(true)
  const errorMessage = ref<string | null>(null)
  const isFinished = ref(false)

  const current = computed<FramesChoiceRound | null>(
    () => rounds.value[currentIndex.value] ?? null,
  )
  const isAnswered = computed(() => selectedId.value !== null)
  const isLastRound = computed(() => currentIndex.value + 1 >= rounds.value.length)

  const contentType = computed<ContentType>(() => {
    const typeParam = route.query.type
    return typeof typeParam === 'string' && isContentType(typeParam) ? typeParam : 'movie'
  })

  function readSetup(): { contentType: ContentType; filterId: string } {
    const filterParam = route.query.filter
    const filterId =
      typeof filterParam === 'string' && filterParam.length > 0
        ? filterParam
        : DEFAULT_FILTER_ID
    return { contentType: contentType.value, filterId }
  }

  async function pickFrameForMovie(
    movie: TmdbMovie,
    contentType: ContentType,
  ): Promise<string | null> {
    try {
      const images = await getContentImages(contentType, movie.id)
      const textless = images.backdrops.filter(
        (img) => img.iso_639_1 === null || img.iso_639_1 === 'xx',
      )
      const wide = textless.filter((img) => img.aspect_ratio > 1.5)
      const pool = wide.length > 0 ? wide : textless
      if (pool.length === 0) return buildTmdbImageUrl(movie.backdrop_path, 'w1280')
      const chosen = pool[Math.floor(Math.random() * pool.length)]
      return buildTmdbImageUrl(chosen.file_path, 'w1280')
    } catch {
      return buildTmdbImageUrl(movie.backdrop_path, 'w1280')
    }
  }

  async function buildRounds() {
    isLoading.value = true
    errorMessage.value = null
    try {
      const { contentType, filterId } = readSetup()
      const language = TMDB_LANGUAGE_BY_LOCALE[localeStore.locale as Locale]
      const pool = await loadMoviePool(language, contentType, filterId)
      if (pool.length < OPTIONS_PER_ROUND + TOTAL_ROUNDS) {
        throw new Error('Pool is too small')
      }

      const targets = pickRandom(pool, TOTAL_ROUNDS)
      const built: FramesChoiceRound[] = []

      for (const target of targets) {
        const imageUrl = await pickFrameForMovie(target, contentType)
        if (!imageUrl) continue
        const distractors = pickRandom(
          pool.filter((m) => m.id !== target.id),
          OPTIONS_PER_ROUND - 1,
        )
        built.push({
          movie: target,
          imageUrl,
          options: shuffle([target, ...distractors]),
        })
      }

      rounds.value = built
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      errorMessage.value = message.includes('token') ? t('game.tokenMissing') : t('game.error')
    } finally {
      isLoading.value = false
    }
  }

  function answer(option: TmdbMovie) {
    if (isAnswered.value || !current.value) return
    selectedId.value = option.id
    if (option.id === current.value.movie.id) score.value += 1
  }

  function next() {
    selectedId.value = null
    if (isLastRound.value) {
      isFinished.value = true
      return
    }
    currentIndex.value += 1
  }

  function restart() {
    currentIndex.value = 0
    score.value = 0
    selectedId.value = null
    isFinished.value = false
    buildRounds()
  }

  return {
    rounds,
    currentIndex,
    current,
    score,
    selectedId,
    isLoading,
    errorMessage,
    isFinished,
    isAnswered,
    isLastRound,
    contentType,
    buildRounds,
    answer,
    next,
    restart,
  }
}
