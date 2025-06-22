import * as functions from 'firebase-functions'

import { db } from '../Firebase/firestoreDB'
import { DB_ENDPOINTS } from '../models'
import { backupUser } from './backupUser'
import { updateMapPins } from './updateMapPins'

import type { IUserDB } from 'oa-shared/models/user'
import type { IDBDocChange } from '../models'

/*********************************************************************
 * Side-effects to be carried out on various user updates, namely:
 * - create user revision history
 * - update map pin location on change
 * - update library creator flag on change
 * - update userName and flag on any comments made by user
 *********************************************************************/
export const handleUserUpdates = functions
  .runWith({ memory: '512MB' })
  .firestore.document(`${DB_ENDPOINTS.users}/{id}`)
  .onUpdate(async (change, _) => {
    await backupUser(change)
    await updateDocuments(change)
  })

async function updateDocuments(change: IDBDocChange) {
  const info = (change.after.exists ? change.after.data() : {}) as IUserDB
  const prevInfo = (change.before.exists ? change.before.data() : {}) as IUserDB

  const prevDeleted = prevInfo._deleted || false
  const deleted = info._deleted || false

  await updateMapPins(prevInfo, info)

  const didDelete = prevDeleted !== deleted && deleted
  if (didDelete) {
    await deleteMapPin(info._id)
  }
}

async function deleteMapPin(_id: string) {
  const pin = await db.collection(DB_ENDPOINTS.mappins).doc(_id).get()

  if (pin.exists) {
    try {
      await pin.ref.update({
        _deleted: true,
        _modified: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error marking map pin as deleted: ', error)
    }
  }
}
