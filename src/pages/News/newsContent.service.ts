import { logger } from 'src/logger'

import type { Category, News } from 'oa-shared'
import type { NewsSortOption } from './NewsSortOptions'

export enum NewsSearchParams {
  category = 'category',
  q = 'q',
  sort = 'sort',
}

const search = async (
  q: string,
  category: string,
  sort: NewsSortOption,
  skip: number = 0,
) => {
  try {
    const url = new URL('/api/news', window.location.origin)
    url.searchParams.set('q', q)
    url.searchParams.set('category', category)
    url.searchParams.set('sort', sort)
    if (skip > 0) {
      url.searchParams.set('skip', skip.toString())
    }
    const response = await fetch(url)

    const { items, total } = (await response.json()) as {
      items: News[]
      total: number
    }
    return { items, total }
  } catch (error) {
    logger.error('Failed to fetch news', { error })
    return { items: [], total: 0 }
  }
}

const getCategories = async () => {
  try {
    const response = await fetch('/api/categories/news')
    return (await response.json()) as Category[]
  } catch (error) {
    logger.error('Failed to fetch news', { error })
    return []
  }
}

export const newsContentService = {
  search,
  getCategories,
}
