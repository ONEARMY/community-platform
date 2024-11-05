import { logger } from 'src/logger'
import type { IResearch, ICategory, ResearchStatus } from 'oa-shared'
import type { ResearchSortOption } from './ResearchSortOptions'

const search = async (
  words: string[],
  category: string,
  sort: ResearchSortOption,
  status: ResearchStatus | null,
  lastDocId?: string,
) => {
  try {
    const response = await fetch(
      `/api/research?words=${words.join(',')}&category=${category}&sort=${sort}&status=${status ?? ''}&last_doc_id=${lastDocId ?? ''}`,
    )
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
    const response = await fetch(`/api/research/drafts/count?user_id=${userId}`)
    const { total } = (await response.json()) as { total: number }

    return total
  } catch (error) {
    logger.error('Failed to fetch draft count', { error })
    return 0
  }
}

const getDrafts = async (userId: string) => {
  try {
    const response = await fetch(`/api/research?drafts=true&user_id=${userId}`)
    const { items } = (await response.json()) as { items: IResearch.Item[] }

    return items
  } catch (error) {
    logger.error('Failed to fetch research draft articles', { error })
    return []
  }
}

export const researchService = {
  search,
  getResearchCategories,
  getDrafts,
  getDraftCount,
}
