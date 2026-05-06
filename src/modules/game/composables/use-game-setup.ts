import { ref, watch } from 'vue'
import type { ContentType } from '../models/setup.types'
import { DEFAULT_FILTER_ID, FILTERS, isFilterAvailableFor } from '../consts/filters'

const VALID_FILTER_IDS = new Set(FILTERS.map((f) => f.id))

/**
 * Local state for the setup screen — content type + filter.
 * Defaults to "Movies" + "All" on every visit (no persistence).
 */
export function useGameSetup() {
  const contentType = ref<ContentType>('movie')
  const filterId = ref<string>(DEFAULT_FILTER_ID)

  // If the chosen filter isn't available for the new content type — fall back to default.
  watch(contentType, (next) => {
    const filter = FILTERS.find((f) => f.id === filterId.value)
    if (filter && !isFilterAvailableFor(filter, next)) {
      filterId.value = DEFAULT_FILTER_ID
    }
  })

  function setContentType(next: ContentType) {
    contentType.value = next
  }

  function setFilter(id: string) {
    if (!VALID_FILTER_IDS.has(id)) return
    filterId.value = id
  }

  return {
    contentType,
    filterId,
    setContentType,
    setFilter,
  }
}
