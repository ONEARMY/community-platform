import { DBDoc, IDBDocChange } from '../models'

/**
 * Automatically create user revision on update
 * Nests revision as subcollection of original document,
 * labeled by previous _modified timestamp
 */
export const backupUser = (change: IDBDocChange) => {
  const { before, after } = change
  const rev = before.data() as DBDoc
  if (rev && rev._modified) {
    return before.ref
      .collection('revisions')
      .doc(rev._modified)
      .set(rev)
  }
}
