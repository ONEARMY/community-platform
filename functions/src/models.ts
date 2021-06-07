import * as functions from 'firebase-functions'

import {
  DBDoc,
  IDBEndpoint,
  IEventDB,
  IHowtoDB,
  IHowtoStats,
  IUserDB,
} from 'one-army-community-platform/lib/models'

export { DBDoc, IDBEndpoint, IEventDB, IHowtoDB, IHowtoStats, IUserDB }

// Note - we don't import from 'oa-shared' as firebase won't be able to bundle correctly
// https://github.com/firebase/firebase-tools/issues/653
import { generateDBEndpoints } from 'oa-shared'
export const DB_ENDPOINTS = generateDBEndpoints()

export type IDBDocChange = functions.Change<
  functions.firestore.DocumentSnapshot
>
