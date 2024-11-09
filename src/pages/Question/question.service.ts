import { collection, getDocs, query, where } from 'firebase/firestore'
import {
  DB_ENDPOINTS,
  type ICategory,
  type IQuestion,
  type IQuestionDB,
} from 'oa-shared'
import { logger } from 'src/logger'
import { firestore } from 'src/utils/firebase'

import type { QuestionSortOption } from './QuestionSortOptions'

export enum QuestionSearchParams {
  category = 'category',
  q = 'q',
  sort = 'sort',
}

const search = async (
  words: string[],
  category: string,
  sort: QuestionSortOption,
  lastDocId?: string | undefined,
) => {
  try {
    const response = await fetch(
      `/api/questions?words=${words.join(',')}&category=${category}&sort=${sort}&lastDocId=${lastDocId ?? ''}`,
    )
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
    const response = await fetch(`/api/questions/categories`)
    const responseJson = (await response.json()) as {
      categories: ICategory[]
    }

    return responseJson.categories
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
