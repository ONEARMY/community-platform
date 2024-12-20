import { json } from '@remix-run/node'
import { collection, getDocs, query } from 'firebase/firestore'
import Keyv from 'keyv'
import { DB_ENDPOINTS } from 'src/models/dbEndpoints'
import { firestore } from 'src/utils/firebase'

import type { ICategory } from 'oa-shared'

const cache = new Keyv<ICategory[]>({ ttl: 3600000 }) // ttl: 60 minutes

export const loader = async () => {
  const cachedCategories = await cache.get('questionCategories')

  // check if cached categories are available, if not - load from db and cache them
  if (cachedCategories) return json({ categories: cachedCategories })

  const collectionRef = collection(firestore, DB_ENDPOINTS.questionCategories)
  const categories = (await getDocs(query(collectionRef))).docs.map(
    (x) => x.data() as ICategory,
  )

  cache.set('questionCategories', categories)
  return json({ categories })
}
