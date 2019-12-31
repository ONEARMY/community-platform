import { DBDoc } from '../stores/databaseV2/types'

// re-export the database dbDoc to make it easier to import elsewhere
export type DBDoc = DBDoc

// A reminder that dates should be saved in the ISOString format
// i.e. new Date().toISOString() => 2011-10-05T14:48:00.000Z
// This is more consistent than others and allows better querying
export type ISODateString = string

// Another reminder, that user ids are saved in string format
type userId = string

export type IDBEndpoint =
  | 'v2_howtos'
  | 'v2_users'
  | 'v2_tags'
  | 'v2_events'
  | 'v2_mappins'

// Types for moderation status
export type ModerationStatus =
  | 'draft'
  | 'awaiting-moderation'
  | 'rejected'
  | 'accepted'

export interface IModerable {
  moderation: ModerationStatus
  _createdBy?: string
  _id?: string
}

/************************************************************************
 *  Deprecates - legacy interfaces used. Currently retained to troubleshoot
 *  upgrades, can remove once database working in production site
 ***************************************************************************/
type IDBEndpointV1 = 'howtosV1' | 'users' | 'tagsV1' | 'eventsV1' | 'mapPinsV1'

// interface DBDocV1 {
//   _id: string
//   _created: firestore.Timestamp
//   _modified: firestore.Timestamp
//   _deleted: boolean
//   _createdBy: userId
// }

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
