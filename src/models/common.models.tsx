// by default all documents should be populated with the following fields
export interface IDbDoc {
  _id: string
  _created: ISODateString
  _modified: ISODateString
  _deleted: boolean
  _createdBy: userId
}

// A reminder that dates should be saved in the ISOString format
// i.e. new Date().toISOString() => 2011-10-05T14:48:00.000Z
// This is more consistent than others and allows better querying
export type ISODateString = string

// Another reminder, that user ids are saved in string format
type userId = string

export type IDBEndpoint =
  | 'v2_howtos'
  | 'v2_users'
  | 'v2_discussions'
  | 'v2_tags'
  | 'v2_events'
  | 'v2_mappins'

/************************************************************************
 *  Deprecates - legacy interfaces used. Currently retained to troubleshoot
 *  upgrades, can remove once database working in production site
 ***************************************************************************/
type IDBEndpointV1 =
  | 'howtosV1'
  | 'users'
  | 'discussions'
  | 'tagsV1'
  | 'eventsV1'
  | 'mapPinsV1'

// interface IDbDocV1 {
//   _id: string
//   _created: firestore.Timestamp
//   _modified: firestore.Timestamp
//   _deleted: boolean
//   _createdBy: userId
// }
