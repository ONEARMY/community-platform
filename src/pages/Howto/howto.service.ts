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
import { hasAdminRights } from 'src/utils/helpers'

import { DB_ENDPOINTS } from '../../models'
import { firestore } from '../../utils/firebase'

import type {
  DocumentData,
  QueryDocumentSnapshot,
  QueryFilterConstraint,
  QueryNonFilterConstraint,
} from 'firebase/firestore'
import type { IHowto, IUser, IUserPPDB } from '../../models'
import type { ICategory } from '../../models/categories.model'
import type { HowtoSortOptions } from './Content/HowtoList/HowtoSortOptions'

export enum HowtosSearchParams {
  category = 'category',
  q = 'q',
  sort = 'sort',
}

const search = async (
  words: string[],
  category: string,
  sort: HowtoSortOptions,
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
  const filters = [where('moderation', '==', 'accepted')]

  if (currentUser) {
    filters.push(where('_createdBy', '==', currentUser.userName))

    if (hasAdminRights(currentUser)) {
      filters.push(where('moderation', '==', 'awaiting-moderation'))
      filters.push(where('moderation', '==', 'improvements-needed'))
    }
  }

  return or(...filters)
}

const createQueries = (
  words: string[],
  category: string,
  sort: HowtoSortOptions,
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

const getSort = (sort: HowtoSortOptions) => {
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
      return orderBy('_modified', 'desc')
  }
}

export const howtoService = {
  search,
  getHowtoCategories,
}

export const exportedForTesting = {
  createQueries,
}
