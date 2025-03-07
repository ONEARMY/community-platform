import { logger } from 'src/logger'

import type { ICategory, ResearchStatus } from 'oa-shared'
import type { ResearchItem } from 'src/models/research.model'
import type { ResearchSortOption } from './ResearchSortOptions'

const search = async (
  words: string[],
  category: string,
  sort: ResearchSortOption,
  status: ResearchStatus | null,
  skip: number = 0,
) => {
  try {
    const url = new URL('/api/research', window.location.origin)
    url.searchParams.append('words', words.join(','))
    url.searchParams.append('category', category)
    url.searchParams.append('sort', sort)
    url.searchParams.append('status', status ?? '')
    url.searchParams.append('skip', skip.toString())

    const response = await fetch(url)
    const { items, total } = (await response.json()) as {
      items: ResearchItem[]
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
    const { items } = (await response.json()) as { items: ResearchItem[] }

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
