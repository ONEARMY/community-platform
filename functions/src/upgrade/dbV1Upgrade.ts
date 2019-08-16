import { db } from '../Firebase/firestoreDB'

/*  Temporary function used to migrate from db V1 docs to V2
    The breaking change comes from converting timestamps to strings
    (explained here: https://github.com/OneArmyWorld/onearmy/issues/343 )
*/

const mappings: DBMapping = {
  discussions: 'v2_discussions',
  eventsV1: 'v2_events',
  howtosV1: 'v2_howtos',
  tagsV1: 'v2_tags',
  users: 'v2_users',
}

export const upgradeDBAll = async () => {
  const promises = Object.keys(mappings).map(async endpoint => {
    await upgradeDBEndpoint(endpoint)
  })
  const updates = await Promise.all(promises)
  return updates
}

const upgradeDBEndpoint = async (endpoint: string) => {
  const snap = await db.collection(endpoint).get()
  const docs = snap.empty ? [] : snap.docs.map(d => d.data())
  const batch = db.batch()
  docs.forEach(d => {
    if (!d._deleted) {
      const v2Doc = upgradeV1Doc(d)
      const v2Endpoint = mappings[endpoint]
      const ref = db.doc(`${v2Endpoint}/${d._key}`)
      batch.set(ref, v2Doc)
    }
  })
  // await batch.commit()
  return docs
}

function upgradeV1Doc(doc: any) {
  // upgrade dates from timestamp
  const dateFields = ['_created', '_modified']
  dateFields.forEach(field => {
    if (doc.hasOwnProperty(field)) {
      doc[field] = _upgradeDate(doc[field])
    }
  })
  const v2Doc = {
    ...doc,
    _modified: _upgradeDate(doc._modified),
    _created: _upgradeDate(doc._created),
  }
  return v2Doc
}

function _upgradeDate(date: any) {
  if (date.hasOwnProperty('seconds')) {
    return new Date(date.seconds)
  } else {
    console.log(date)
    throw new Error(`no date upgrade method: ${JSON.stringify(date)}`)
  }
}

type DBMapping = { [key in IDBEndpointV1]: IDBEndpointV2 }

type IDBEndpointV1 =
  | 'howtosV1'
  | 'users'
  | 'discussions'
  | 'tagsV1'
  | 'eventsV1'

type IDBEndpointV2 =
  | 'v2_howtos'
  | 'v2_users'
  | 'v2_discussions'
  | 'v2_tags'
  | 'v2_events'
