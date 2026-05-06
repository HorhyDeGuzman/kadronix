import { tmdbRequest } from '@/core/api/tmdb-client'
import type {
  TmdbCreditsResponse,
  TmdbImagesResponse,
  TmdbMovie,
  TmdbPaginated,
} from '../models/movie.types'
import type { ContentType } from '../models/setup.types'

/* ───── Movies ───── */

export function getPopularMovies(page = 1, language = 'ru-RU') {
  return tmdbRequest<TmdbPaginated<TmdbMovie>>('/movie/popular', {
    page: String(page),
    language,
  })
}

export function getTopRatedMovies(page = 1, language = 'ru-RU') {
  return tmdbRequest<TmdbPaginated<TmdbMovie>>('/movie/top_rated', {
    page: String(page),
    language,
  })
}

export function getMovieImages(movieId: number) {
  return tmdbRequest<TmdbImagesResponse>(`/movie/${movieId}/images`, {
    include_image_language: 'null,xx',
  })
}

export function getMovieCredits(movieId: number, language = 'ru-RU') {
  return tmdbRequest<TmdbCreditsResponse>(`/movie/${movieId}/credits`, { language })
}

export function searchMovies(query: string, language = 'ru-RU') {
  return tmdbRequest<TmdbPaginated<TmdbMovie>>('/search/movie', {
    query,
    language,
    include_adult: 'false',
  })
}

/* ───── TV ───── */

interface TmdbTvShowRaw {
  id: number
  name: string
  original_name: string
  first_air_date: string
  poster_path: string | null
  backdrop_path: string | null
  popularity: number
  vote_average: number
  vote_count: number
  overview: string
}

/** Normalise TV show to TmdbMovie shape so the rest of the game logic stays type-stable. */
function normalizeTvShow(raw: TmdbTvShowRaw): TmdbMovie {
  return {
    id: raw.id,
    title: raw.name,
    original_title: raw.original_name,
    release_date: raw.first_air_date,
    poster_path: raw.poster_path,
    backdrop_path: raw.backdrop_path,
    popularity: raw.popularity,
    vote_average: raw.vote_average,
    vote_count: raw.vote_count,
    overview: raw.overview,
  }
}

export function getTvImages(tvId: number) {
  return tmdbRequest<TmdbImagesResponse>(`/tv/${tvId}/images`, {
    include_image_language: 'null,xx',
  })
}

export function getTvCredits(tvId: number, language = 'ru-RU') {
  return tmdbRequest<TmdbCreditsResponse>(`/tv/${tvId}/credits`, { language })
}

/* ───── Discover (filtered) ───── */

export interface DiscoverParams {
  language?: string
  page?: number
  /** TMDB genre ID */
  withGenres?: number
  /** Inclusive year (use first day of year) */
  yearFrom?: number
  /** Inclusive year (use last day of year) */
  yearTo?: number
  /** Sort key. Default: popularity.desc */
  sortBy?: 'popularity.desc' | 'vote_average.desc' | 'vote_count.desc'
  /** Min vote count for vote_average.desc to filter out poorly-rated obscure titles */
  voteCountGte?: number
}

async function discover(
  contentType: ContentType,
  params: DiscoverParams,
): Promise<TmdbPaginated<TmdbMovie>> {
  const language = params.language ?? 'ru-RU'
  const page = params.page ?? 1
  const sortBy = params.sortBy ?? 'popularity.desc'

  const query: Record<string, string> = {
    language,
    page: String(page),
    sort_by: sortBy,
    include_adult: 'false',
  }

  if (params.withGenres !== undefined) {
    query.with_genres = String(params.withGenres)
  }

  if (params.voteCountGte !== undefined) {
    query['vote_count.gte'] = String(params.voteCountGte)
  }

  if (contentType === 'movie') {
    if (params.yearFrom !== undefined) {
      query['primary_release_date.gte'] = `${params.yearFrom}-01-01`
    }
    if (params.yearTo !== undefined) {
      query['primary_release_date.lte'] = `${params.yearTo}-12-31`
    }
    return tmdbRequest<TmdbPaginated<TmdbMovie>>('/discover/movie', query)
  }

  // TV
  if (params.yearFrom !== undefined) {
    query['first_air_date.gte'] = `${params.yearFrom}-01-01`
  }
  if (params.yearTo !== undefined) {
    query['first_air_date.lte'] = `${params.yearTo}-12-31`
  }
  const raw = await tmdbRequest<TmdbPaginated<TmdbTvShowRaw>>('/discover/tv', query)
  return {
    ...raw,
    results: raw.results.map(normalizeTvShow),
  }
}

export function discoverContent(
  contentType: ContentType,
  params: DiscoverParams,
): Promise<TmdbPaginated<TmdbMovie>> {
  return discover(contentType, params)
}

/* ───── Polymorphic helpers (movie or tv) ───── */

export function getContentImages(contentType: ContentType, id: number) {
  return contentType === 'movie' ? getMovieImages(id) : getTvImages(id)
}

export function getContentCredits(
  contentType: ContentType,
  id: number,
  language = 'ru-RU',
) {
  return contentType === 'movie'
    ? getMovieCredits(id, language)
    : getTvCredits(id, language)
}
