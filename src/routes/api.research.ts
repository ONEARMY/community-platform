import { json } from '@remix-run/node'
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
import { ITEMS_PER_PAGE } from 'src/pages/Research/constants'
import { firestore } from 'src/utils/firebase'

import type {
  QueryFilterConstraint,
  QueryNonFilterConstraint,
} from 'firebase/firestore'
import type { IResearch, ResearchStatus } from 'oa-shared'
import type { ResearchSortOption } from 'src/pages/Research/ResearchSortOptions.ts'

// runs on the server
export const loader = async ({ request }) => {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  const words: string[] =
    searchParams.get('words') != ''
      ? searchParams.get('words')?.split(',') ?? []
      : []
  const category: string | null = searchParams.get('category')
  const sort: ResearchSortOption = (searchParams.get('sort') ??
    'LatestUpdated') as ResearchSortOption
  const status: ResearchStatus | null = searchParams.get(
    'status',
  ) as ResearchStatus
  const lastDocId: string | null = searchParams.get('lastDocId')
  const drafts: boolean = searchParams.get('drafts') != undefined
  const userId: string | null = searchParams.get('userId')

  const { itemsQuery, countQuery } = await createSearchQuery(
    words,
    category,
    sort,
    status,
    lastDocId,
    ITEMS_PER_PAGE,
    drafts,
    userId,
  )

  const documentSnapshots = await getDocs(itemsQuery)
  const items = documentSnapshots.docs
    ? documentSnapshots.docs.map((x) => x.data() as IResearch.Item)
    : []

  let total: number | undefined = undefined
  // get total only if not requesting drafts
  if (!drafts || !userId)
    total = (await getCountFromServer(countQuery)).data().count

  return json({ items, total })
}

export const action = async ({ request }) => {
  const method = request.method
  switch (method) {
    case 'POST':
      // Create new research
      return json({ message: 'Created a research' })
    case 'PUT':
      // Edit existing research
      return json({ message: 'Updated a research' })
    case 'DELETE':
      // Delete a research
      return json({ message: 'Deleted a research' })
    default:
      return json({ message: 'Method Not Allowed' }, { status: 405 })
  }
}

const createSearchQuery = async (
  words: string[],
  category: string | null,
  sort: ResearchSortOption,
  status: ResearchStatus | null,
  lastDocId: string | null,
  page_size: number,
  drafts: boolean,
  userId: string | null,
) => {
  let filters: QueryFilterConstraint[] = []
  if (drafts && userId) {
    filters = [
      and(
        where('_createdBy', '==', userId),
        where('moderation', 'in', [
          IModerationStatus.AWAITING_MODERATION,
          IModerationStatus.DRAFT,
          IModerationStatus.IMPROVEMENTS_NEEDED,
          IModerationStatus.REJECTED,
        ]),
        where('_deleted', '!=', true),
      ),
    ]
  } else {
    filters = [
      and(
        where('_deleted', '!=', true),
        where('moderation', '==', IModerationStatus.ACCEPTED),
      ),
    ]
  }

  let constraints: QueryNonFilterConstraint[] = []

  const sortByField = getSortByField(sort)
  constraints = [orderBy(sortByField, 'desc')] // TODO - add sort by _id to act as a tie breaker

  if (words?.length > 0) {
    filters = [...filters, and(where('keywords', 'array-contains-any', words))]
  }

  if (category) {
    filters = [...filters, where('researchCategory._id', '==', category)]
  }

  if (status) {
    filters = [...filters, where('researchStatus', '==', status)]
  }

  const collectionRef = collection(firestore, DB_ENDPOINTS.research)
  const countQuery = query(collectionRef, and(...filters), ...constraints)

  // add pagination only to itemsQuery, not countQuery
  if (lastDocId) {
    const lastDocSnapshot = await getDoc(
      doc(collection(firestore, DB_ENDPOINTS.research), lastDocId),
    )

    if (!lastDocSnapshot.exists) {
      throw new Error('Document with the provided ID does not exist.')
    }
    const lastDocData = lastDocSnapshot.data() as IResearch.Item

    constraints.push(startAfter(lastDocData[sortByField])) // TODO - add startAfter by _id to act as a tie breaker
  }

  const itemsQuery = query(
    collectionRef,
    and(...filters),
    ...constraints,
    limit(page_size),
  )

  return { countQuery, itemsQuery }
}

const getSortByField = (sort: ResearchSortOption) => {
  switch (sort) {
    case 'MostComments':
      return 'totalCommentCount'
    case 'MostUpdates':
      return 'totalUpdates'
    case 'MostUseful':
      return 'totalUsefulVotes'
    case 'Newest':
      return '_created'
    case 'LatestUpdated':
      return '_contentModifiedTimestamp'
    default:
      return '_contentModifiedTimestamp'
  }
}
