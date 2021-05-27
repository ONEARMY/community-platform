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

export { DB_ENDPOINTS } from 'oa-shared'

export type IDBDocChange = functions.Change<FirebaseFirestore.DocumentSnapshot>
