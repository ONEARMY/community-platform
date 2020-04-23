import { DBDoc as DBDocImport } from 'src/stores/databaseV2/types'

// re-export the database dbDoc to make it easier to import elsewhere
export type DBDoc = DBDocImport

// A reminder that dates should be saved in the ISOString format
// i.e. new Date().toISOString() => 2011-10-05T14:48:00.000Z
// This is more consistent than others and allows better querying
export type ISODateString = string

// Another reminder, that user ids are saved in string format
type userId = string

export type IDBEndpoint =
  | 'v3_howtos'
  | 'v3_users'
  | 'v3_tags'
  | 'v3_events'
  | 'v3_mappins'

// Types for moderation status
export type IModerationStatus =
  | 'draft'
  | 'awaiting-moderation'
  | 'rejected'
  | 'accepted'

export interface IModerable {
  moderation: IModerationStatus
  _createdBy?: string
  _id?: string
}

/*****************************************************************
 *            Algolia Locations
 ****************************************************************/
// algolia doesn't provide typings so taken from
// https://community.algolia.com/places/documentation.html
// implementation contains more fields but assumed not relevant

export interface ILocation {
  name: string
  country: string
  countryCode: string
  administrative: string
  latlng: ILatLng
  postcode: string
  value: string
}
interface ILatLng {
  lat: number
  lng: number
}
