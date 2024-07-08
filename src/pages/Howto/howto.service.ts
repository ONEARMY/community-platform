import {
  and,
  collection,
  getCountFromServer,
  getDocs,
  limit,
  or,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore'
import { IModerationStatus } from 'oa-shared'
import { DB_ENDPOINTS } from 'src/models/dbEndpoints'
import { hasAdminRights } from 'src/utils/helpers'

import { firestore } from '../../utils/firebase'

import type {
  DocumentData,
  QueryDocumentSnapshot,
  QueryFilterConstraint,
  QueryNonFilterConstraint,
} from 'firebase/firestore'
import type { IHowto, IUser, IUserPPDB } from '../../models'
import type { ICategory } from '../../models/categories.model'
import type { HowtoSortOption } from './Content/HowtoList/HowtoSortOptions'

export enum HowtosSearchParams {
  category = 'category',
  q = 'q',
  sort = 'sort',
}

const search = async (
  words: string[],
  category: string,
  sort: HowtoSortOption,
  currentUser?: IUserPPDB,
  snapshot?: QueryDocumentSnapshot<DocumentData, DocumentData>,
  take: number = 10,
) => {
  const { itemsQuery, countQuery } = createQueries(
    words,
    category,
    sort,
    currentUser,
    snapshot,
    take,
  )

  const documentSnapshots = await getDocs(itemsQuery)
  const lastVisible = documentSnapshots.docs
    ? documentSnapshots.docs[documentSnapshots.docs.length - 1]
    : undefined

  const items = documentSnapshots.docs
    ? documentSnapshots.docs.map((x) => x.data() as IHowto)
    : []
  const total = (await getCountFromServer(countQuery)).data().count

  return { items, total, lastVisible }
}

const moderationFilters = (currentUser?: IUser) => {
  const filters = [where('moderation', '==', IModerationStatus.ACCEPTED)]

  if (currentUser) {
    if (hasAdminRights(currentUser)) {
      filters.push(
        where('moderation', '==', IModerationStatus.AWAITING_MODERATION),
      )
      filters.push(
        where('moderation', '==', IModerationStatus.IMPROVEMENTS_NEEDED),
      )
    }
  }

  return or(...filters)
}

const createQueries = (
  words: string[],
  category: string,
  sort: HowtoSortOption,
  currentUser?: IUser,
  snapshot?: QueryDocumentSnapshot<DocumentData, DocumentData>,
  take: number = 10,
) => {
  const collectionRef = collection(firestore, DB_ENDPOINTS.howtos)
  let filters: QueryFilterConstraint[] = [
    and(where('_deleted', '!=', true), moderationFilters(currentUser)),
  ]
  let constraints: QueryNonFilterConstraint[] = []

  if (words?.length > 0) {
    filters = [...filters, and(where('keywords', 'array-contains-any', words))]
  }

  if (category) {
    filters = [...filters, and(where('category._id', '==', category))]
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

const getHowtoCategories = async () => {
  const collectionRef = collection(firestore, DB_ENDPOINTS.categories)

  return (await getDocs(query(collectionRef))).docs.map(
    (x) => x.data() as ICategory,
  )
}

const createDraftQuery = (userId: string) => {
  const collectionRef = collection(firestore, DB_ENDPOINTS.howtos)
  const filters = and(
    where('_createdBy', '==', userId),
    where('moderation', 'in', [
      IModerationStatus.AWAITING_MODERATION,
      IModerationStatus.DRAFT,
      IModerationStatus.IMPROVEMENTS_NEEDED,
      IModerationStatus.REJECTED,
    ]),
    where('_deleted', '!=', true),
  )

  const countQuery = query(collectionRef, filters)
  const itemsQuery = query(
    collectionRef,
    filters,
    orderBy('_contentModifiedTimestamp', 'desc'),
  )

  return { countQuery, itemsQuery }
}

const getDraftCount = async (userId: string) => {
  const { countQuery } = createDraftQuery(userId)

  return (await getCountFromServer(countQuery)).data().count
}

const getDrafts = async (userId: string) => {
  const { itemsQuery } = createDraftQuery(userId)
  const docs = await getDocs(itemsQuery)

  return docs.docs ? docs.docs.map((x) => x.data() as IHowto) : []
}

const getSort = (sort: HowtoSortOption) => {
  switch (sort) {
    case 'MostComments':
      return orderBy('totalComments', 'desc')
    case 'MostUseful':
      return orderBy('totalUsefulVotes', 'desc')
    case 'Newest':
      return orderBy('_created', 'desc')
    case 'MostDownloads':
      return orderBy('total_downloads', 'desc')
    case 'LatestUpdated':
      return orderBy('_contentModifiedTimestamp', 'desc')
  }
}

export const howtoService = {
  search,
  getHowtoCategories,
  getDraftCount,
  getDrafts,
}

export const exportedForTesting = {
  createQueries,
}
