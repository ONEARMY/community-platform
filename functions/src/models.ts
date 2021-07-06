import * as functions from 'firebase-functions'

// Import and Re-export models from the main platform if required by functions
import {
  DBDoc,
  IDBEndpoint,
  IEventDB,
  IHowtoDB,
  IHowtoStats,
  IUserDB,
  IMapPin,
} from 'one-army-community-platform/lib/models'
export { DBDoc, IDBEndpoint, IEventDB, IHowtoDB, IHowtoStats, IUserDB, IMapPin }

import { generateDBEndpoints } from 'oa-shared'
export const DB_ENDPOINTS = generateDBEndpoints()

export type IDBDocChange = functions.Change<
  functions.firestore.DocumentSnapshot
>
