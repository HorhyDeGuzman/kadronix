const API_BASE = import.meta.env.VITE_TMDB_API_BASE
const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE

export type TmdbImageSize =
  | 'w92'
  | 'w154'
  | 'w185'
  | 'w300'
  | 'w342'
  | 'w500'
  | 'w780'
  | 'w1280'
  | 'original'

export function buildTmdbImageUrl(
  path: string | null,
  size: TmdbImageSize = 'w500',
): string | null {
  if (!path) return null
  return `${IMAGE_BASE}/${size}${path}`
}

export async function tmdbRequest<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<T> {
  const url = new URL(`${API_BASE}${path}`)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<T>
}
