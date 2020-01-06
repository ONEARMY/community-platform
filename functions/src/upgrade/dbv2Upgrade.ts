import { db } from '../Firebase/firestoreDB'

/**
 * Temporary function used to migrate from db V2 docs to V3
    Changes:
    - Add moderation fields to how-tos, events, mappins, users (#847)
    - Format usernames to slug format
    - Add username display fields
    - Update howto and event _createdBy to reflect new users
 */
export const upgradeV2DB = async () => {
  const promises = Object.keys(mappings).map(async endpoint => {
    const upgradedDocs = await upgradeDBEndpoint(endpoint as IDBEndpointV2)
    return upgradedDocs
  })
  const updates = await Promise.all(promises)
  console.log('upgrade complete')
  return updates
}

const upgradeDBEndpoint = async (endpoint: IDBEndpointV2) => {
  console.log('upgrading endpoint', endpoint)
  const snap = await db.collection(endpoint).get()
  const docs = snap.empty
    ? []
    : snap.docs.map(d => {
        return { ...(d.data() as any), _id: d.id }
      })
  console.log(`|${endpoint}|: [${docs.length}] docs to upgrade`)
  if (docs.length > 500) {
    throw new Error('Too many docs for batch, chunking required')
  }
  const batch = db.batch()
  // remove deleted docs and upgrade
  const v3Docs = docs.filter(d => !d._deleted).map(d => upgrade(d, endpoint))
  const v2Endpoint = mappings[endpoint]
  v3Docs.forEach(doc => {
    const ref = db.doc(`${v2Endpoint}/${doc._id}`)
    batch.set(ref, doc)
  })
  console.log(`|${endpoint}|: upgrade ready`)
  await batch.commit()
  return v3Docs
}

function upgrade(doc: any, endpoint: IDBEndpointV2) {
  switch (endpoint) {
    case 'v2_events':
      return {
        ...doc,
        moderation: doc.moderation ? doc.moderation : 'accepted',
        _createdBy: formatLowerNoSpecial(doc._createdBy),
      }
    case 'v2_howtos':
      return {
        ...doc,
        moderation: doc.moderation ? doc.moderation : 'accepted',
        _createdBy: formatLowerNoSpecial(doc._createdBy),
      }
    case 'v2_mappins':
      return {
        ...doc,
        _id: formatLowerNoSpecial(doc._id),
        moderation: doc.moderation ? doc.moderation : 'accepted',
        _createdBy: formatLowerNoSpecial(doc._createdBy),
      }
    case 'v2_users':
      return {
        ...doc,
        moderation: doc.moderation ? doc.moderation : 'accepted',
        _createdBy: formatLowerNoSpecial(doc._createdBy),
        _id: formatLowerNoSpecial(doc._id),
        displayName: doc.userName || doc._id || 'NA',
        userName: formatLowerNoSpecial(doc.userName),
      }
    default:
      return doc
  }
}

/*****************************************************************************
 *  Imported functions - note, direct import not working so copied from src
 ******************************************************************************/
// remove special characters from string, also replacing spaces with dashes
const stripSpecialCharacters = (text: string) => {
  return text
    ? text
        .split(' ')
        .join('-')
        .replace(/[^a-zA-Z0-9_-]/gi, '')
    : ''
}

// convert to lower case and remove any special characters
const formatLowerNoSpecial = (text: string) => {
  return stripSpecialCharacters(text).toLowerCase()
}

/*****************************************************************************
 *  Constants & Types
 ******************************************************************************/
const mappings: { [key in IDBEndpointV2]: IDBEndpointV3 } = {
  v2_events: 'v3_events',
  v2_howtos: 'v3_howtos',
  v2_mappins: 'v3_mappins',
  v2_tags: 'v3_tags',
  v2_users: 'v3_users',
}

type IDBEndpointV2 =
  | 'v2_events'
  | 'v2_howtos'
  | 'v2_mappins'
  | 'v2_tags'
  | 'v2_users'
type IDBEndpointV3 =
  | 'v3_events'
  | 'v3_howtos'
  | 'v3_mappins'
  | 'v3_tags'
  | 'v3_users'
