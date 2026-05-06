export type ContentType = 'movie' | 'tv'

export const CONTENT_TYPES: ContentType[] = ['movie', 'tv']

export function isContentType(value: string): value is ContentType {
  return (CONTENT_TYPES as string[]).includes(value)
}

export type FilterKind = 'all' | 'top' | 'decade' | 'genre'

export interface FilterDefinition {
  id: string
  kind: FilterKind
  labelKey: string
  /** for kind=decade — start year, range = [start, start+9] */
  decadeStart?: number
  /** for kind=genre — TMDB genre id for movies */
  movieGenreId?: number
  /** for kind=genre — TMDB genre id for tv shows (some may differ from movie ids) */
  tvGenreId?: number
}

export interface GameSetup {
  contentType: ContentType
  filterId: string
}
