export type GameMode = 'frames-choice' | 'actors-choice'

export const GAME_MODES: GameMode[] = ['frames-choice', 'actors-choice']

export function isGameMode(value: string): value is GameMode {
  return (GAME_MODES as string[]).includes(value)
}
