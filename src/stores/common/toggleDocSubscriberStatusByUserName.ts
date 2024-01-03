import { logger } from 'src/logger'

import type { IQuestion } from 'src/models'
import type { DatabaseV2 } from '../databaseV2'
import type { DBEndpoint } from '../databaseV2/endpoints'

export const toggleDocSubscriberStatusByUserName = async (
  db: DatabaseV2,
  collectionName: DBEndpoint,
  docId: string,
  userName: string,
) => {
  const dbRef = db.collection<IQuestion.Item>(collectionName).doc(docId)

  if (!dbRef) {
    logger.warn('Unable to find document', { docId })
    return null
  }

  const doc = await dbRef.get()

  let subscribers = doc?.subscribers || []

  if (doc?.subscribers?.includes(userName)) {
    subscribers = subscribers.filter((s) => s !== userName)
  } else {
    subscribers.push(userName)
  }

  dbRef.update({ _id: docId, subscribers } as any)

  return await dbRef.get()
}
