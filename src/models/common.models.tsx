import { DBDoc as DBDocImport } from '../stores/databaseV2/types'
import { DBEndpoint } from '../stores/databaseV2/'
import { DB_PREFIX as DB_PREFIX_IMPORT } from '../stores/databaseV2/config'

// A reminder that dates should be saved in the ISOString format
// i.e. new Date().toISOString() => 2011-10-05T14:48:00.000Z
// This is more consistent than others and allows better querying
export type ISODateString = string

// Simply re-exported main database endpoints for convenience
// and re-import into functions
export type IDBEndpoint = DBEndpoint
export const DB_PREFIX = DB_PREFIX_IMPORT
export type DBDoc = DBDocImport

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
