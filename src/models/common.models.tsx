import { firestore } from 'firebase/app'

// by default all documents are populated with the following fields by the database
export interface IDbDoc {
  _id: string
  _created: firestore.Timestamp
  _modified: firestore.Timestamp
  _deleted: boolean
}
