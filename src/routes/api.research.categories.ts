import { json } from '@remix-run/node'
import { collection, getDocs, query, where } from 'firebase/firestore'
import Keyv from 'keyv'
import { DB_ENDPOINTS } from 'oa-shared'
import { firestore } from 'src/utils/firebase'

import type { ICategory } from 'oa-shared'

const cache = new Keyv<ICategory[]>({ ttl: 3600000 }) // ttl: 60 minutes

// runs on the server
export const loader = async () => {
  const cachedCategories = await cache.get('researchCategories')

  // check if cached categories are available, if not - load from db and cache them
  if (cachedCategories) return json({ categories: cachedCategories })

  const collectionRef = collection(firestore, DB_ENDPOINTS.researchCategories)
  const categoriesQuery = query(collectionRef, where('_deleted', '!=', true))

  const categories: ICategory[] = (await getDocs(categoriesQuery)).docs.map(
    (x) => x.data() as ICategory,
  )

  cache.set('researchCategories', categories)
  return json({ categories })
}
