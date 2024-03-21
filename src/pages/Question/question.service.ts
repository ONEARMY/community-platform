import {
  and,
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore'

import { DB_ENDPOINTS } from '../../models'
import { firestore } from '../../utils/firebase'
import { QuestionSortOptions } from './QuestionSortOptions'

import type {
  DocumentData,
  QueryDocumentSnapshot,
  QueryFilterConstraint,
  QueryNonFilterConstraint,
} from 'firebase/firestore'
import type { IQuestion } from '../../models'
import type { ICategory } from '../../models/categories.model'

const search = async (
  words: string[],
  category: string,
  sort: QuestionSortOptions,
  snapshot?: QueryDocumentSnapshot<DocumentData, DocumentData>,
  take: number = 10,
) => {
  const { itemsQuery, countQuery } = createQueries(
    words,
    category,
    sort,
    snapshot,
    take,
  )

  const documentSnapshots = await getDocs(itemsQuery)
  const lastVisible = documentSnapshots.docs
    ? documentSnapshots.docs[documentSnapshots.docs.length - 1]
    : undefined

  const items = documentSnapshots.docs
    ? documentSnapshots.docs.map((x) => x.data() as IQuestion.Item)
    : []
  const total = (await getCountFromServer(countQuery)).data().count

  return { items, total, lastVisible }
}

const createQueries = (
  words: string[],
  category: string,
  sort: QuestionSortOptions,
  snapshot?: QueryDocumentSnapshot<DocumentData, DocumentData>,
  take: number = 10,
) => {
  const collectionRef = collection(firestore, DB_ENDPOINTS.questions)
  let filters: QueryFilterConstraint[] = []
  let constraints: QueryNonFilterConstraint[] = []

  if (words?.length > 0) {
    filters = [...filters, and(where('keywords', 'array-contains-any', words))]
  }

  if (category) {
    filters = [...filters, where('questionCategory._id', '==', category)]
  }

  if (sort) {
    const sortConstraint = getSort(sort)

    if (sortConstraint) {
      constraints = [...constraints, sortConstraint]
    }
  }

  const countQuery = query(collectionRef, and(...filters), ...constraints)

  if (snapshot) {
    constraints = [...constraints, startAfter(snapshot)]
  }

  const itemsQuery = query(
    collectionRef,
    and(...filters),
    ...constraints,
    limit(take),
  )

  return { countQuery, itemsQuery }
}

const getQuestionCategories = async () => {
  const collectionRef = collection(firestore, DB_ENDPOINTS.questionCategories)

  return (await getDocs(query(collectionRef))).docs.map(
    (x) => x.data() as ICategory,
  )
}

const getSort = (sort: QuestionSortOptions) => {
  switch (sort) {
    case QuestionSortOptions.Comments:
      return orderBy('commentCount', 'desc')
    case QuestionSortOptions.LeastComments:
      return orderBy('commentCount', 'asc')
    case QuestionSortOptions.Newest:
      return orderBy('_created', 'desc')
    case QuestionSortOptions.LatestComments:
      return orderBy('latestCommentDate', 'desc')
    case QuestionSortOptions.LatestUpdated:
      return orderBy('_modified', 'desc')
  }
}

export const questionService = {
  search,
  getQuestionCategories,
}

export const exportedForTesting = {
  createQueries,
}
