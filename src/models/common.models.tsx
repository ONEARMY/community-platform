import { firestore } from 'firebase/app'

// by default all documents should be populated with the following fields
export interface IDbDoc {
  _id: string
  _created: firestore.Timestamp
  _modified: firestore.Timestamp
  _deleted: boolean
  _createdBy: userId
}

type userId = string
