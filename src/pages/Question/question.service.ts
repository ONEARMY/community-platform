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
import { DB_ENDPOINTS } from 'src/models'
import { ItemSortingOption } from 'src/stores/common/FilterSorterDecorator/FilterSorterDecorator'
import { firestore } from 'src/utils/firebase'

import type {
  DocumentReference,
  QueryFilterConstraint,
  QueryNonFilterConstraint,
} from 'firebase/firestore'
import type { IQuestion } from 'src/models'
import type { ICategory } from 'src/models/categories.model'

const search = async (
  text: string,
  category: string,
  sort: ItemSortingOption,
  snapshot?: DocumentReference,
  take: number = 10,
) => {
  const collectionRef = collection(firestore, DB_ENDPOINTS.questions)
  let filters: QueryFilterConstraint[] = []
  let constraints: QueryNonFilterConstraint[] = []

  if (text) {
    const words = text.toLowerCase().split(' ') // keywords are stored lowercase

    filters = [...filters, and(where('keywords', 'array-contains-any', words))]
  }

  if (category) {
    filters = [...filters, where('category', '==', category)]
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

  const items = (await getDocs(itemsQuery)).docs.map((x) => ({
    ...(x.data() as IQuestion.Item),
    ref: x.ref,
  }))
  const total = (await getCountFromServer(countQuery)).data().count

  return { items, total }
}

const getQuestionCategories = async () => {
  const collectionRef = collection(firestore, DB_ENDPOINTS.questionCategories)

  return (await getDocs(query(collectionRef))).docs.map(
    (x) => x.data() as ICategory,
  )
}

const getSort = (sort: ItemSortingOption) => {
  switch (sort) {
    case ItemSortingOption.Comments:
      return orderBy('commentCount', 'desc')
    case ItemSortingOption.LeastComments:
      return orderBy('commentCount', 'asc')
    case ItemSortingOption.Newest:
      return orderBy('_created', 'desc')
    case ItemSortingOption.LatestComments:
      return orderBy('latestCommentDate', 'desc')
    case ItemSortingOption.LatestUpdated:
      return orderBy('_modified', 'desc')
  }
}

export const questionService = {
  search,
  getQuestionCategories,
}
