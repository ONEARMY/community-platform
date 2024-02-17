import { toJS } from 'mobx'

import type { IVotedUsefulUpdate } from 'src/models'
import type { DatabaseV2 } from '../databaseV2/DatabaseV2'
import type { DBEndpoint } from '../databaseV2/endpoints'

export const toggleDocUsefulByUser = async (
  db: DatabaseV2,
  collectionName: DBEndpoint,
  docId: string,
  userName: string,
) => {
  const dbRef = db.collection<IVotedUsefulUpdate>(collectionName).doc(docId)

  const docData = await toJS(dbRef.get('server'))
  if (!docData) return

  const votedUsefulBy = !(docData?.votedUsefulBy || []).includes(userName)
    ? [userName].concat(docData?.votedUsefulBy || [])
    : (docData?.votedUsefulBy || []).filter((uName) => uName !== userName)

  const votedUsefulUpdate = {
    _id: docId,
    votedUsefulBy: votedUsefulBy,
  }

  await dbRef.update(votedUsefulUpdate)

  return await dbRef.get()
}
