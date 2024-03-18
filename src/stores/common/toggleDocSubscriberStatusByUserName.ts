import { toJS } from 'mobx'
import { logger } from 'src/logger'

import type { IQuestion } from 'src/models'
import type { DatabaseV2 } from '../databaseV2/DatabaseV2'
import type { DBEndpoint } from '../databaseV2/endpoints'

export const toggleDocSubscriberStatusByUserName = async (
  db: DatabaseV2,
  collectionName: DBEndpoint,
  _id: string,
  userName: string,
) => {
  const dbRef = db.collection<IQuestion.Item>(collectionName).doc(_id)

  if (!dbRef) {
    logger.warn('Unable to find document', { _id })
    return null
  }

  const docData = await toJS(dbRef.get('server'))

  let subscribers = docData?.subscribers || []
  if (docData?.subscribers?.includes(userName)) {
    subscribers = subscribers.filter((s) => s !== userName)
  } else {
    subscribers.push(userName)
  }

  await dbRef.update({ _id, subscribers })

  return await dbRef.get()
}
