import { toJS } from 'mobx'

import type { IQuestionItem, IResearchItem } from '../../models'
import type { DatabaseV2 } from '../databaseV2/DatabaseV2'
import type { DBEndpoint } from '../databaseV2/endpoints'

export const toggleDocSubscriberStatusByUserName = async (
  db: DatabaseV2,
  collectionName: DBEndpoint,
  _id: string,
  userName: string,
) => {
  const dbRef = db
    .collection<IQuestionItem | IResearchItem>(collectionName)
    .doc(_id)
  const docData = await toJS(dbRef.get('server'))

  if (!docData) return

  const subscribers = !(docData?.subscribers || []).includes(userName)
    ? [userName].concat(docData?.subscribers || [])
    : (docData?.subscribers || []).filter((uName) => uName !== userName)

  const subscribersUpdated = { _id, subscribers }

  await dbRef.update(subscribersUpdated as any)

  return await dbRef.get()
}
