import * as functions from 'firebase-functions'

// Import and Re-export models from the main platform if required by functions

// NOTE - as of yarn 3.3 we need to import relatively instead of from a workspace import.
// This is because the functions code sits at same level of main platform package.json, creating cyclic symlinks
// functions -> node_modules -> community-plaform -> functions -> node_modules ....

// Importing from outside the src code is still fine because we make single builds with webpack
// which can resolve at build time, but would not work if deploying direct to firebase functions.
// Alternative fix would be to put the platform code one level further nested e.g. <root>/platform/src
import type {
  DBDoc,
  IDBEndpoint,
  IEventDB,
  IHowtoDB,
  IMapPin,
  IModerable,
  IResearchDB,
  IUserDB,
  IPendingEmails,
} from '../../src/models'
export {
  DBDoc,
  IDBEndpoint,
  IEventDB,
  IHowtoDB,
  IUserDB,
  IMapPin,
  IModerable,
  IResearchDB,
  IPendingEmails,
}

import { dbEndpointSubollections, generateDBEndpoints } from 'oa-shared'
export const DB_ENDPOINTS = generateDBEndpoints()
export const DB_ENDPOINT_SUBCOLLECTIONS = dbEndpointSubollections

export type IDBDocChange =
  functions.Change<functions.firestore.DocumentSnapshot>
