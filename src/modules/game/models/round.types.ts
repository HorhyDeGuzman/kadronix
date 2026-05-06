import type { TmdbCastMember, TmdbMovie } from './movie.types'

export interface FramesChoiceRound {
  movie: TmdbMovie
  imageUrl: string
  options: TmdbMovie[]
}

export interface ActorsChoiceRound {
  movie: TmdbMovie
  cast: TmdbCastMember[]
  options: TmdbMovie[]
}
