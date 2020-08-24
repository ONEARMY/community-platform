import * as functions from 'firebase-functions'
import { DBDoc, IDBEndpoint } from '../models'

// TODO - fix links to main repo and handle with prefix_endpoint type checking
const USERS_ENDPOINT = 'v3_users'

/**
 * Automatically create user revision on update
 * Nests revision as subcollection of original document,
 * labeled by previous _modified timestamp
 */
export const FirebaseUserBackup = functions.firestore
  .document(`${USERS_ENDPOINT}/{username}`)
  .onUpdate((change, context) => {
    const { before, after } = change
    const rev = before.data() as DBDoc
    if (rev && rev._modified) {
      return before.ref
        .collection('revisions')
        .doc(rev._modified)
        .set(rev)
    }
    return null
  })
