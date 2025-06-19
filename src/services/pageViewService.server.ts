import { doc, increment, updateDoc } from 'firebase/firestore'
import { DB_ENDPOINTS } from 'oa-shared'
import { firestore } from 'src/utils/firebase'

type PageViewCollections = Pick<typeof DB_ENDPOINTS, 'users'>

const incrementViewCount = async (
  collectionName: keyof PageViewCollections,
  id: string,
) => {
  const docRef = doc(firestore, DB_ENDPOINTS[collectionName], id)

  return await updateDoc(docRef, {
    total_views: increment(1),
  })
}

export const pageViewService = {
  incrementViewCount,
}
