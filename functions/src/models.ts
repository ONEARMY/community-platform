import * as functions from 'firebase-functions'

import {
  DBDoc,
  IDBEndpoint,
  IEventDB,
  IHowtoDB,
  IHowtoStats,
  IUserDB,
} from '../../src/models'

export { DBDoc, IDBEndpoint, IEventDB, IHowtoDB, IHowtoStats, IUserDB }

import { generateDBEndpoints } from 'oa-shared'
export const DB_ENDPOINTS = generateDBEndpoints()

export type IDBDocChange = functions.Change<FirebaseFirestore.DocumentSnapshot>
