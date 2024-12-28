import { collection, getDocs, query, where } from 'firebase/firestore'
import { DB_ENDPOINTS, type IQuestion, type IQuestionDB } from 'oa-shared'
import { logger } from 'src/logger'
import { firestore } from 'src/utils/firebase'

import type { Category } from 'src/models/category.model'
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
  lastDocId?: string | undefined,
) => {
  try {
    const url = new URL('/api/questions', window.location.origin)
    url.searchParams.set('q', q)
    url.searchParams.set('category', category)
    url.searchParams.set('sort', sort)
    url.searchParams.set('lastDocId', lastDocId ?? '')
    const response = await fetch(url)

    const { items, total } = (await response.json()) as {
      items: IQuestion.Item[]
      total: number
    }
    const lastVisibleId = items ? items[items.length - 1]._id : undefined
    return { items, total, lastVisibleId }
  } catch (error) {
    logger.error('Failed to fetch questions', { error })
    return { items: [], total: 0 }
  }
}

const getQuestionCategories = async () => {
  try {
    const response = await fetch('/api/categories/questions')
    return (await response.json()) as Category[]
  } catch (error) {
    logger.error('Failed to fetch questions', { error })
    return []
  }
}

const getBySlug = async (slug: string) => {
  let snapshot = await getDocs(
    query(
      collection(firestore, DB_ENDPOINTS.questions),
      where('slug', '==', slug),
    ),
  )

  if (snapshot.size === 0) {
    // try previous slugs if slug is not recognized as primary
    snapshot = await getDocs(
      query(
        collection(firestore, DB_ENDPOINTS.questions),
        where('previousSlugs', 'array-contains', slug),
      ),
    )
  }

  if (snapshot.size === 0) {
    return null
  }

  return snapshot.docs[0].data() as IQuestionDB
}

export const questionService = {
  search,
  getQuestionCategories,
  getBySlug,
}
