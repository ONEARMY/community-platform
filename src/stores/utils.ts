import type { HowtoStore } from './Howto/howto.store'
import type { ResearchStore } from './Research/research.store'

export const storeHasAuthorFunctionality = (
  store: any,
): store is HowtoStore | ResearchStore => {
  return (
    store &&
    typeof store.selectedAuthor !== 'undefined' &&
    typeof store.updateSelectedAuthor === 'function'
  )
}
