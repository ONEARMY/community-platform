import { collection, getDocs, query, where } from 'firebase/firestore'
import { DB_ENDPOINTS } from 'oa-shared'
import { logger } from 'src/logger'
import { firestore } from 'src/utils/firebase'
import { changeUserReferenceToPlainText } from 'src/utils/mentions.utils'

import type {
  ICategory,
  IResearch,
  IResearchDB,
  ResearchStatus,
} from 'oa-shared'
import type { ResearchSortOption } from './ResearchSortOptions'

const search = async (
  words: string[],
  category: string,
  sort: ResearchSortOption,
  status: ResearchStatus | null,
  lastDocId?: string,
) => {
  try {
    const url = new URL('/api/research', window.location.origin)
    url.searchParams.append('words', words.join(','))
    url.searchParams.append('category', category)
    url.searchParams.append('sort', sort)
    url.searchParams.append('status', status ?? '')
    url.searchParams.append('lastDocId', lastDocId ?? '')

    const response = await fetch(url)
    const { items, total } = (await response.json()) as {
      items: IResearch.Item[]
      total: number
    }

    return { items, total }
  } catch (error) {
    logger.error('Failed to fetch research articles', { error })
    return { items: [], total: 0 }
  }
}

const getResearchCategories = async () => {
  try {
    const response = await fetch('/api/research/categories')
    const { categories } = (await response.json()) as {
      categories: ICategory[]
    }

    return categories
  } catch (error) {
    logger.error('Failed to fetch draft count', { error })
    return []
  }
}

const getDraftCount = async (userId: string) => {
  try {
    const response = await fetch(`/api/research/drafts/count?userId=${userId}`)
    const { total } = (await response.json()) as { total: number }

    return total
  } catch (error) {
    logger.error('Failed to fetch draft count', { error })
    return 0
  }
}

const getDrafts = async (userId: string) => {
  try {
    const response = await fetch(`/api/research?drafts=true&userId=${userId}`)
    const { items } = (await response.json()) as { items: IResearch.Item[] }

    return items
  } catch (error) {
    logger.error('Failed to fetch research draft articles', { error })
    return []
  }
}

const getBySlug = async (slug: string) => {
  // Get all that match the slug, to avoid creating an index (blocker for cypress tests)
  let snapshot = await getDocs(
    query(
      collection(firestore, DB_ENDPOINTS.research),
      where('slug', '==', slug),
    ),
  )

  if (snapshot.size === 0) {
    // try previous slugs if slug is not recognized as primary
    snapshot = await getDocs(
      query(
        collection(firestore, DB_ENDPOINTS.research),
        where('previousSlugs', 'array-contains', slug),
      ),
    )
  }

  if (snapshot.size === 0) {
    return null
  }

  const research = snapshot.docs[0].data() as IResearchDB

  if (!research) {
    return null
  }

  // Change all UserReferences to mentions
  if (research.description) {
    research.description = changeUserReferenceToPlainText(research.description)
  }

  for (const update of research.updates) {
    if (!update.description) {
      continue
    }

    update.description = changeUserReferenceToPlainText(update.description)
  }

  return research
}

export const researchService = {
  search,
  getResearchCategories,
  getDrafts,
  getDraftCount,
  getBySlug,
}
