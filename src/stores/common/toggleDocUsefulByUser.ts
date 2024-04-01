import { toJS } from 'mobx'

import type { IQuestion, IResearch } from 'src/models'
import type { DatabaseV2 } from '../databaseV2/DatabaseV2'
import type { DBEndpoint } from '../databaseV2/endpoints'

export const toggleDocUsefulByUser = async (
  db: DatabaseV2,
  collectionName: DBEndpoint,
  _id: string,
  userName: string,
) => {
  const dbRef = db
    .collection<IQuestion.Item | IResearch.Item>(collectionName)
    .doc(_id)
  const docData = await toJS(dbRef.get('server'))

  if (!docData) return

  const votedUsefulBy = !(docData?.votedUsefulBy || []).includes(userName)
    ? [userName].concat(docData?.votedUsefulBy || [])
    : (docData?.votedUsefulBy || []).filter((uName) => uName !== userName)

  const votedUsefulUpdate = {
    _id,
    votedUsefulBy,
    totalUsefulVotes: votedUsefulBy.length,
  }

  await dbRef.update(votedUsefulUpdate)

  return await dbRef.get()
}
