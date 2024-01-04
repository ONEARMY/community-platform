import { HowtoStore } from './Howto/howto.store'
import { ResearchStore } from './Research/research.store'

export function storeHasAuthorFunctionality(
  store: any,
): store is HowtoStore | ResearchStore {
  return (
    store &&
    typeof store.selectedAuthor !== 'undefined' &&
    typeof store.updateSelectedAuthor === 'function'
  )
}
