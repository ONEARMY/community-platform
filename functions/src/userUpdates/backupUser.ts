import { DBDoc, IDBDocChange } from '../models'

/** Helper function to check if the only field changed is lastActive
 * (updates on login), in which case we will not want
 * to backup the user again.
 */
const hasUserDataUpdated = (prevUser: DBDoc, updatedUser: DBDoc): boolean => {
  return Object.keys(prevUser).some(
    key =>
      key !== '_modified' &&
      key !== '_lastActive' &&
      prevUser[key] !== updatedUser[key],
  )
}

/**
 * Automatically create user revision on update
 * Nests revision as subcollection of original document,
 * labeled by previous _modified timestamp
 */
export const backupUser = (change: IDBDocChange) => {
  const { before, after } = change
  const rev = before.data() as DBDoc
  const updated = after.data() as DBDoc
  if (rev && rev._modified && hasUserDataUpdated(rev, updated)) {
    return before.ref
      .collection('revisions')
      .doc(rev._modified)
      .set(rev)
  }
}
