// tslint:disable no-implicit-dependencies
// import { IDBEndpoint } from '@OAModels/common.models'
import * as rtdb from './realtimeDB'
import * as firestore from './firestoreDB'
import { IDBEndpoint, DBDoc } from '../models'

/*  Functions in this folder are used to sync data between firestore and firebase realtime databases
    The reason for this is to allow large collections to be 'cached' for cheap retrieval
    An example would be the map pins. When a user first visits the map all pins are downloaded
    The previous map had 30,000 pins, so this would cost roughly $0.02c, or $20 per 1000 users
    By pulling the data from firebase realtime instead and only subscribing to updates, this is
    dramatically reduced. For more information about the various database strategies see:
    https://github.com/OneArmyWorld/onearmy/wiki/Backend-Database
*/

const endpoints: IDBEndpoint[] = [
  'v3_events',
  'v3_howtos',
  'v3_mappins',
  'v3_tags',
  // NOTE - do not want to keep list of sync'd users
  // 'v3_users',
]

export const syncAll = async () => {
  const promises = endpoints.map(async endpoint => await sync(endpoint))
  const results = await Promise.all(promises)
  const response = {}
  endpoints.forEach((endpoint, i) => (response[endpoint] = results[i]))
  return response
}

// for given endpoint, query rtdb for all records, determin latest,
// query firestore for newer records, add to rtdb
export const sync = async (endpoint: IDBEndpoint) => {
  const existing = await rtdb.get(endpoint)
  const latest =
    existing && Object.keys(existing).length > 1
      ? Object.values<DBDoc>(existing).sort((a, b) => _sortByModified(a, b))[0]
          ._modified
      : ''

  const update = await firestore.db
    .collection(endpoint)
    .where('_modified', '>', latest)
    .get()
  const docs = update.empty ? [] : update.docs.map(d => d.data())
  const json = {}
  docs.forEach(doc => (json[doc._id] = doc))
  await rtdb.update(endpoint, json)
  return json
}

function _sortByModified(a: DBDoc, b: DBDoc) {
  return a._modified > b._modified ? -1 : 1
}

export const test = async () => {
  const endpoint: IDBEndpoint = 'v3_howtos'
  const data = await rtdb.get(endpoint)
  return Object.values(data)
}
