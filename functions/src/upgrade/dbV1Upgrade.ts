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
    const upgradedDocs = await upgradeDBEndpoint(endpoint)
    return upgradedDocs
  })
  const updates = await Promise.all(promises)
  console.log('upgrade complete')
  return updates
}

const upgradeDBEndpoint = async (endpoint: string) => {
  console.log('upgrading endpoint', endpoint)
  const snap = await db.collection(endpoint).get()
  const docs = snap.empty ? [] : snap.docs.map(d => d.data())
  console.log(`|${endpoint}|: [${docs.length}] docs to upgrade`)
  const batch = db.batch()
  docs.forEach(d => {
    if (!d._deleted) {
      try {
        const v2Doc = upgradeV1Doc(d)
        const v2Endpoint = mappings[endpoint]
        const ref = db.doc(`${v2Endpoint}/${d._id}`)
        batch.set(ref, v2Doc)
      } catch (error) {
        console.log(d)
        throw new Error('unable to upgrade doc')
      }
    }
  })
  console.log(`|${endpoint}|: upgrade ready`)
  await batch.commit()
  return docs
}

function upgradeV1Doc(doc: any) {
  // upgrade timestamps on all docs
  const metaFields = ['_created', '_modified']
  metaFields.forEach(field => {
    doc[field] = _upgradeDate(doc[field])
  })
  // upgrade other specific fields
  const optionalFields = ['_lastResponse', 'year', 'date']
  optionalFields.forEach(field => {
    // ignore case where field set to null (discussions)
    if (doc.hasOwnProperty(field) && doc[field]) {
      doc[field] = _upgradeDate(doc[field])
    }
  })

  return doc
}

function _upgradeDate(date: any) {
  if (date.hasOwnProperty('_seconds') && date.hasOwnProperty('_nanoseconds')) {
    const millis = date._seconds * 1000 + date._nanoseconds / 1e6
    return new Date(millis)
  } else {
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
