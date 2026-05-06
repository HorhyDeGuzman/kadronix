export interface TmdbMovie {
  id: number
  title: string
  original_title: string
  release_date: string
  poster_path: string | null
  backdrop_path: string | null
  popularity: number
  vote_average: number
  vote_count: number
  overview: string
}

export interface TmdbPaginated<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface TmdbImage {
  file_path: string
  width: number
  height: number
  aspect_ratio: number
  vote_average: number
  iso_639_1: string | null
}

export interface TmdbImagesResponse {
  id: number
  backdrops: TmdbImage[]
  posters: TmdbImage[]
  logos: TmdbImage[]
}

export interface TmdbCastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface TmdbCreditsResponse {
  id: number
  cast: TmdbCastMember[]
}
