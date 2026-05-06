import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { TMDB_LANGUAGE_BY_LOCALE, type Locale } from '@/common/i18n'
import { useLocaleStore } from '@/common/store/locale.store'
import { OPTIONS_PER_ROUND, TOTAL_ROUNDS } from '../consts/game'
import { DEFAULT_FILTER_ID } from '../consts/filters'
import { pickRandom, shuffle } from '../helpers/shuffle'
import type { ActorsChoiceRound, TmdbCastMember, TmdbMovie } from '../models'
import { isContentType, type ContentType } from '../models/setup.types'
import { getContentCredits } from '../services/tmdb-api'
import { loadMoviePool } from '../services/movie-pool.service'

const ACTORS_PER_ROUND = 3

export function useActorsChoiceGame() {
  const { t } = useI18n()
  const localeStore = useLocaleStore()
  const route = useRoute()

  const rounds = ref<ActorsChoiceRound[]>([])
  const currentIndex = ref(0)
  const score = ref(0)
  const selectedId = ref<number | null>(null)
  const isLoading = ref(true)
  const errorMessage = ref<string | null>(null)
  const isFinished = ref(false)

  const current = computed<ActorsChoiceRound | null>(
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

  async function pickCastForMovie(
    movie: TmdbMovie,
    contentType: ContentType,
    language: string,
  ): Promise<TmdbCastMember[] | null> {
    try {
      const credits = await getContentCredits(contentType, movie.id, language)
      const withPhotos = credits.cast
        .filter((m) => m.profile_path)
        .sort((a, b) => a.order - b.order)
        .slice(0, ACTORS_PER_ROUND)
      if (withPhotos.length < ACTORS_PER_ROUND) return null
      return withPhotos
    } catch {
      return null
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

      const shuffled = pickRandom(pool, pool.length)
      const built: ActorsChoiceRound[] = []

      for (const target of shuffled) {
        if (built.length >= TOTAL_ROUNDS) break
        const cast = await pickCastForMovie(target, contentType, language)
        if (!cast) continue
        const distractors = pickRandom(
          pool.filter((m) => m.id !== target.id),
          OPTIONS_PER_ROUND - 1,
        )
        built.push({
          movie: target,
          cast,
          options: shuffle([target, ...distractors]),
        })
      }

      if (built.length === 0) {
        throw new Error('No movies with sufficient cast')
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
