// (note - typings don't currently exist for firebase-tools: https://github.com/firebase/firebase-tools/issues/2378)
import axios from 'axios'
import * as firebase_tools from 'firebase-tools'

import { db } from '../../Firebase/firestoreDB'
import { DB_ENDPOINTS } from '../../models'
import { splitArrayToChunks } from '../../Utils/data.utils'

import type { firestore } from 'firebase-admin'

/**
 * Script used to generate a cleaner export of seed data for use in development
 *
 * Given a full dump of site data in the emulator, strips away all user docs and revisions
 * for users that have not posted content to mappins, library or research
 * (basically anywhere their profile might be linked from)
 */
export async function seedDataClean() {
  const dbCollections = await db.listCollections()
  const dbEndpoints = dbCollections.map((c) => c.id)
  console.log('db endpoints', dbEndpoints)
  const expectedEndpoints = Object.values(DB_ENDPOINTS)
  const returnMessage = {
    endpoints: { deleted: {} as any, kept: {} as any },
  }

  // Delete collections not in use
  for (const endpoint of dbEndpoints) {
    if (!expectedEndpoints.includes(endpoint)) {
      await deleteCollectionAPI(endpoint)
      returnMessage.endpoints.deleted[endpoint] = 'All'
    } else {
      returnMessage.endpoints.kept[endpoint] = 'All'
    }
  }

  // setup variables and types for tracking data
  const keptUsers = {}
  const endpointsToCheck = ['mappins', 'library', 'research'] as const
  type ICheckedEndpoint = (typeof endpointsToCheck)[number]
  const allDocs: {
    [endpoint in ICheckedEndpoint]: firestore.QuerySnapshot<firestore.DocumentData>
  } = {} as any

  // Get list of users with library or mappins to retain data
  for (const endpoint of endpointsToCheck) {
    const mappedEndpoint = DB_ENDPOINTS[endpoint]
    if (mappedEndpoint) {
      const snapshot = await db.collection(mappedEndpoint).get()
      allDocs[endpoint as any] = snapshot
      snapshot.docs.forEach((doc) => {
        switch (endpoint) {
          case 'mappins':
            keptUsers[doc.id] = true
            break
          default:
            const data = doc.data()
            keptUsers[data._createdBy] = true
        }
      })
    }
  }
  // await WiPReduceSeedSize()

  // Delete non-required users in batches
  const deletedUsers = await deleteQueryDocs(
    db.collection(DB_ENDPOINTS.users),
    '[Users Deleted]',
    (doc) => !keptUsers[doc.data()._id],
  )
  returnMessage.endpoints.deleted.users = deletedUsers.length
  // Delete nested revision docs (TODO - should add filter to ensure doc ref is a subcollection of users)
  const deletedRevisions = await deleteQueryDocs(
    db.collectionGroup('revisions'),
    '[Revisions Deleted]',
    (doc) => !keptUsers[doc.data()._id],
  )
  returnMessage.endpoints.deleted['revisions'] = deletedRevisions.length
  // Delete nested stats docs
  const deletedStats = await deleteQueryDocs(
    db.collectionGroup('stats'),
    '[Stats Deleted]',
    (doc) => !keptUsers[doc.data()._id],
  )
  returnMessage.endpoints.deleted['stats'] = deletedStats.length
  returnMessage.endpoints.kept.users = Object.keys(keptUsers).length

  return returnMessage
}

/** Execute a firestore query and delete all retrieved docs, subject to optional filter function */
async function deleteQueryDocs(
  query:
    | firestore.CollectionGroup<firestore.DocumentData>
    | firestore.CollectionReference<firestore.DocumentData>,
  logPrefix = '[Deleted]',
  filterFn = (doc: firestore.QueryDocumentSnapshot) => false,
) {
  const queryResults = await query.get()
  const filteredResults = queryResults.docs.filter((doc) => filterFn(doc))
  await batchDeleteDocs(filteredResults, logPrefix)
  return filteredResults
}

async function batchDeleteDocs(
  docs: firestore.QueryDocumentSnapshot<firestore.DocumentData>[],
  logPrefix = '[Deleted]',
) {
  const refs = docs.map((doc) => doc.ref)
  const chunks = splitArrayToChunks(refs, 500)
  let currentChunk = 0
  const totalDocs = refs.length
  for (const chunk of chunks) {
    const batch = db.batch()
    for (const ref of chunk) {
      batch.delete(ref)
    }
    await batch.commit()
    const deleteCount = currentChunk * 500 + chunk.length
    console.log(`${logPrefix} [${deleteCount}] of ${totalDocs}`)
    currentChunk++
    await _waitForNextTick()
  }
}

/** Simple wrapper function to avoid cascading knock-ons for triggered functions etc. */
function _waitForNextTick(): Promise<void> {
  return new Promise((resolve) => process.nextTick(() => resolve()))
}

/**
 * Use rest api to delete documents being served on the emulator
 * @param endpoint
 * @returns
 */
async function deleteCollectionAPI(endpoint: string) {
  const apiHost =
    'http://0.0.0.0:4003/emulator/v1/projects/demo-community-platform-emulated' // http://[::1] for non-docker env
  return axios.delete(`${apiHost}/databases/(default)/documents/${endpoint}`)
}
