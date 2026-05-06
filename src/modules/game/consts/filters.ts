import type { FilterDefinition } from '../models/setup.types'

/**
 * Filter catalog. The order here defines display order in setup UI.
 * TMDB genre IDs reference: https://developer.themoviedb.org/reference/genre-movie-list
 */
export const FILTERS: FilterDefinition[] = [
  // Special
  { id: 'all', kind: 'all', labelKey: 'filters.all' },
  { id: 'top', kind: 'top', labelKey: 'filters.top' },

  // Decades
  { id: 'decade-70', kind: 'decade', labelKey: 'filters.decade70', decadeStart: 1970 },
  { id: 'decade-80', kind: 'decade', labelKey: 'filters.decade80', decadeStart: 1980 },
  { id: 'decade-90', kind: 'decade', labelKey: 'filters.decade90', decadeStart: 1990 },
  { id: 'decade-2000', kind: 'decade', labelKey: 'filters.decade2000', decadeStart: 2000 },
  { id: 'decade-2010', kind: 'decade', labelKey: 'filters.decade2010', decadeStart: 2010 },
  { id: 'decade-2020', kind: 'decade', labelKey: 'filters.decade2020', decadeStart: 2020 },

  // Genres
  { id: 'genre-comedy', kind: 'genre', labelKey: 'filters.comedy', movieGenreId: 35, tvGenreId: 35 },
  { id: 'genre-drama', kind: 'genre', labelKey: 'filters.drama', movieGenreId: 18, tvGenreId: 18 },
  { id: 'genre-action', kind: 'genre', labelKey: 'filters.action', movieGenreId: 28, tvGenreId: 10759 },
  { id: 'genre-thriller', kind: 'genre', labelKey: 'filters.thriller', movieGenreId: 53 },
  { id: 'genre-horror', kind: 'genre', labelKey: 'filters.horror', movieGenreId: 27 },
  { id: 'genre-scifi', kind: 'genre', labelKey: 'filters.scifi', movieGenreId: 878, tvGenreId: 10765 },
  { id: 'genre-crime', kind: 'genre', labelKey: 'filters.crime', movieGenreId: 80, tvGenreId: 80 },
  { id: 'genre-romance', kind: 'genre', labelKey: 'filters.romance', movieGenreId: 10749 },
  { id: 'genre-animation', kind: 'genre', labelKey: 'filters.animation', movieGenreId: 16, tvGenreId: 16 },
]

export const DEFAULT_FILTER_ID = 'all'

export function getFilterById(id: string): FilterDefinition {
  return FILTERS.find((f) => f.id === id) ?? FILTERS[0]
}

/**
 * Genres that don't have a direct equivalent on TMDB TV side
 * (Horror, Thriller, Romance) — they get hidden when "Сериалы" is selected.
 */
export function isFilterAvailableFor(
  filter: FilterDefinition,
  contentType: 'movie' | 'tv',
): boolean {
  if (filter.kind !== 'genre') return true
  if (contentType === 'movie') return filter.movieGenreId !== undefined
  return filter.tvGenreId !== undefined
}
