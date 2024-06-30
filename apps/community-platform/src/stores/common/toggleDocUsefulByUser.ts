import { doc, getDoc, increment, updateDoc } from 'firebase/firestore'

import { firestore } from '../../utils/firebase'
import { DB_ENDPOINTS, type DBEndpoint } from '../databaseV2/endpoints'

export const toggleDocUsefulByUser = async (
  collectionName: DBEndpoint,
  _id: string,
  userName: string,
) => {
  const dbRef = doc(firestore, DB_ENDPOINTS[collectionName], _id)
  const docData = (await getDoc(dbRef))?.data()

  if (!docData) return

  const exists = (docData.votedUsefulBy || []).includes(userName)

  const votedUsefulBy = exists
    ? (docData?.votedUsefulBy || []).filter((uName) => uName !== userName)
    : [userName].concat(docData?.votedUsefulBy || [])

  // update collection doc
  await updateDoc(dbRef, {
    _id,
    votedUsefulBy,
    totalUsefulVotes: votedUsefulBy.length,
  })

  // update user total
  const userRef = doc(firestore, DB_ENDPOINTS.users, userName)
  await updateDoc(userRef, {
    // Note: If the field does not exist or if the current field value is not a numeric value, the operation sets the field to the given value.
    totalUseful: increment(exists ? -1 : 1),
  })

  return (await getDoc(dbRef)).data()
}
