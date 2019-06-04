import { firestore } from 'firebase/app'

// by default all documents should be populated with the following fields
export interface IDbDoc {
  _id: string
  _created: firestore.Timestamp
  _modified: firestore.Timestamp
  _deleted: boolean
  _createdBy: userId
}
// not strictly required, more for reference
type userId = string

// this is a subset of information pull from algolia places api
export interface ILocation {
  name: string
  country: string
  countryCode: string
  label?: string
  address?: string
  lat: number
  lng: number
}
