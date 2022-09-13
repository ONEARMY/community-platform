import * as functions from 'firebase-functions'

// Import and Re-export models from the main platform if required by functions
import type {
  DBDoc,
  IDBEndpoint,
  IEventDB,
  IHowtoDB,
  IMapPin,
  IModerable,
  IResearchDB,
  IUserDB,
} from 'one-army-community-platform/src/models'
export {
  DBDoc,
  IDBEndpoint,
  IEventDB,
  IHowtoDB,
  IUserDB,
  IMapPin,
  IModerable,
  IResearchDB,
}

import { dbEndpointSubollections, generateDBEndpoints } from 'oa-shared'
export const DB_ENDPOINTS = generateDBEndpoints()
export const DB_ENDPOINT_SUBCOLLECTIONS = dbEndpointSubollections

export type IDBDocChange =
  functions.Change<functions.firestore.DocumentSnapshot>
