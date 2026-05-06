import { getFilterById } from '../consts/filters'
import { MIN_VOTE_COUNT } from '../consts/game'
import type { TmdbMovie } from '../models/movie.types'
import type { ContentType } from '../models/setup.types'
import {
  discoverContent,
  getPopularMovies,
  getTopRatedMovies,
  type DiscoverParams,
} from './tmdb-api'

const cache = new Map<string, TmdbMovie[]>()

const TARGET_POOL_SIZE = 240
const MAX_PAGES = 12

function cacheKey(contentType: ContentType, filterId: string, language: string) {
  return `${contentType}:${filterId}:${language}`
}

function buildDiscoverParams(filterId: string, contentType: ContentType): DiscoverParams {
  const filter = getFilterById(filterId)
  const params: DiscoverParams = {}

  switch (filter.kind) {
    case 'top':
      params.sortBy = 'vote_average.desc'
      params.voteCountGte = 1500
      break
    case 'decade':
      if (filter.decadeStart !== undefined) {
        params.yearFrom = filter.decadeStart
        params.yearTo = filter.decadeStart + 9
      }
      params.voteCountGte = MIN_VOTE_COUNT
      break
    case 'genre': {
      const id = contentType === 'movie' ? filter.movieGenreId : filter.tvGenreId
      if (id !== undefined) params.withGenres = id
      params.voteCountGte = MIN_VOTE_COUNT
      break
    }
    case 'all':
    default:
      params.voteCountGte = MIN_VOTE_COUNT
      break
  }

  return params
}

async function loadPopularPool(language: string): Promise<TmdbMovie[]> {
  // Pull 5 pages of popular + 5 pages of top-rated → up to 200 unique titles.
  const POPULAR_PAGES = 5
  const TOP_PAGES = 5

  const requests: Promise<{ results: TmdbMovie[] }>[] = []
  for (let p = 1; p <= POPULAR_PAGES; p++) {
    requests.push(getPopularMovies(p, language))
  }
  for (let p = 1; p <= TOP_PAGES; p++) {
    requests.push(getTopRatedMovies(p, language))
  }

  const pages = await Promise.all(requests)

  const seen = new Set<number>()
  const pool: TmdbMovie[] = []

  for (const page of pages) {
    for (const movie of page.results) {
      if (seen.has(movie.id)) continue
      if (movie.vote_count < MIN_VOTE_COUNT) continue
      if (!movie.backdrop_path) continue
      seen.add(movie.id)
      pool.push(movie)
    }
  }

  return pool
}

async function loadDiscoverPool(
  contentType: ContentType,
  filterId: string,
  language: string,
): Promise<TmdbMovie[]> {
  const baseParams = buildDiscoverParams(filterId, contentType)
  const seen = new Set<number>()
  const pool: TmdbMovie[] = []

  // First page tells us total_pages — used to randomly span the full range.
  const first = await discoverContent(contentType, { ...baseParams, language, page: 1 })
  for (const item of first.results) {
    if (seen.has(item.id) || !item.backdrop_path) continue
    seen.add(item.id)
    pool.push(item)
  }

  const totalPages = Math.min(first.total_pages ?? 1, 500)

  // Randomise page selection within the first ~3x of MAX_PAGES to vary results
  // between sessions while keeping titles still recognisable (popular sort).
  const reachable = Math.min(totalPages, MAX_PAGES * 3)
  const pageOrder = shufflePages(2, reachable).slice(0, MAX_PAGES - 1)

  for (const page of pageOrder) {
    if (pool.length >= TARGET_POOL_SIZE) break
    const res = await discoverContent(contentType, { ...baseParams, language, page })
    for (const item of res.results) {
      if (seen.has(item.id)) continue
      if (!item.backdrop_path) continue
      seen.add(item.id)
      pool.push(item)
    }
  }

  return pool
}

/** Returns a shuffled array of page numbers in [start, end] inclusive. */
function shufflePages(start: number, end: number): number[] {
  if (end < start) return []
  const arr: number[] = []
  for (let p = start; p <= end; p++) arr.push(p)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Build (and cache) a movie/tv pool for a given content type + filter.
 * Pool is large (200+ items) so 10 random rounds vary between sessions.
 */
export async function loadMoviePool(
  language: string,
  contentType: ContentType = 'movie',
  filterId: string = 'all',
): Promise<TmdbMovie[]> {
  const key = cacheKey(contentType, filterId, language)
  const cached = cache.get(key)
  if (cached) return cached

  let pool: TmdbMovie[]
  if (filterId === 'all' && contentType === 'movie') {
    pool = await loadPopularPool(language)
  } else {
    pool = await loadDiscoverPool(contentType, filterId, language)
  }

  cache.set(key, pool)
  return pool
}
