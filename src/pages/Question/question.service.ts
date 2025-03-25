import { logger } from 'src/logger'

import type { Question } from 'src/models/question.model'
import type { QuestionSortOption } from './QuestionSortOptions'

export enum QuestionSearchParams {
  category = 'category',
  q = 'q',
  sort = 'sort',
}

const search = async (
  q: string,
  category: string,
  sort: QuestionSortOption,
  skip: number = 0,
) => {
  try {
    const url = new URL('/api/questions', window.location.origin)
    url.searchParams.set('q', q)
    url.searchParams.set('category', category)
    url.searchParams.set('sort', sort)
    if (skip > 0) {
      url.searchParams.set('skip', skip.toString())
    }
    const response = await fetch(url)

    const { items, total } = (await response.json()) as {
      items: Question[]
      total: number
    }
    return { items, total }
  } catch (error) {
    logger.error('Failed to fetch questions', { error })
    return { items: [], total: 0 }
  }
}

export const questionService = {
  search,
}
