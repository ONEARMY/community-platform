import { IDbDoc } from 'src/models/common.models'
import { Database } from 'src/stores/database'

// by default all documents saved in the database should contain
// a small subset of meta, including _id, _created, and _modified fields
export const DB_META_MOCK: IDbDoc = Database.generateDocMeta('_mocks')
