import { json } from '@remix-run/node'
import {
  and,
  collection,
  getCountFromServer,
  query,
  where,
} from 'firebase/firestore'
import { DB_ENDPOINTS, IModerationStatus } from 'oa-shared'
import { firestore } from 'src/utils/firebase'

// runs on the server
export const loader = async ({ request }) => {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  const userId: string | null = searchParams.get('userId')

  const collectionRef = collection(firestore, DB_ENDPOINTS.research)
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
  const total = (await getCountFromServer(countQuery)).data().count

  return json({ total })
}
