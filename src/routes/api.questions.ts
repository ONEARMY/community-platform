import {
  and,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore'
import { IModerationStatus } from 'oa-shared'
import { DB_ENDPOINTS } from 'src/models/dbEndpoints'
import { ITEMS_PER_PAGE } from 'src/pages/Question/constants'
import { firestore } from 'src/utils/firebase'

import type {
  QueryFilterConstraint,
  QueryNonFilterConstraint,
} from 'firebase/firestore'
import type { IQuestion } from 'oa-shared'
import type { QuestionSortOption } from 'src/pages/Question/QuestionSortOptions'

export const loader = async ({ request }) => {
  const params = new URLSearchParams(request.url)
  const words: string[] =
    params.get('words') != '' ? params.get('words')?.split(',') ?? [] : []
  const category = params.get('category') || ''
  const sort = params.get('sort') as QuestionSortOption
  const lastDocId = params.get('lastDocId') || ''
  const { itemsQuery, countQuery } = await createQueries(
    words,
    category,
    sort,
    lastDocId,
    ITEMS_PER_PAGE,
  )

  const documentSnapshots = await getDocs(itemsQuery)

  const items = documentSnapshots.docs
    ? documentSnapshots.docs.map((x) => {
        const item = x.data() as IQuestion.Item
        return {
          ...item,
          commentCount: 0,
        }
      })
    : []
  const total = (await getCountFromServer(countQuery)).data().count

  return { items, total }
}

const createQueries = async (
  words: string[],
  category: string,
  sort: QuestionSortOption,
  lastDocId?: string | undefined,
  take: number = 10,
) => {
  const collectionRef = collection(firestore, DB_ENDPOINTS.questions)
  let filters: QueryFilterConstraint[] = [
    and(
      where('_deleted', '!=', true),
      where('moderation', '==', IModerationStatus.ACCEPTED),
    ),
  ]
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

  if (lastDocId) {
    const lastDocSnapshot = await getDoc(
      doc(collection(firestore, DB_ENDPOINTS.questions), lastDocId),
    )

    if (!lastDocSnapshot.exists) {
      throw new Error('Document with the provided ID does not exist.')
    }
    console.log('lastDocSnapshot', lastDocSnapshot)
    console.log('startAfter', startAfter)
    startAfter(lastDocSnapshot)
    constraints.push(startAfter(lastDocSnapshot))
  }

  const itemsQuery = query(
    collectionRef,
    and(...filters),
    ...constraints,
    limit(take),
  )

  return { countQuery, itemsQuery }
}

const getSort = (sort: QuestionSortOption) => {
  switch (sort) {
    case 'Comments':
      return orderBy('commentCount', 'desc')
    case 'LeastComments':
      return orderBy('commentCount', 'asc')
    case 'Newest':
      return orderBy('_created', 'desc')
    case 'LatestComments':
      return orderBy('latestCommentDate', 'desc')
    case 'LatestUpdated':
      return orderBy('_modified', 'desc')
  }
}

export const exportedForTesting = {
  createQueries,
}
