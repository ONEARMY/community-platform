// (note - typings don't currently exist for firebase-tools: https://github.com/firebase/firebase-tools/issues/2378)
import * as firebase_tools from 'firebase-tools'
import { DB_ENDPOINTS } from '../../models'
import { db } from '../../Firebase/firestoreDB'
import { splitArrayToChunks } from '../../Utils/data.utils'
import type { firestore } from 'firebase-admin'
import axios from 'axios'

const USE_SMALL_SAMPLE_SEED = false

/**
 * Script used to generate a cleaner export of seed data for use in development
 *
 * Given a full dump of site data in the emulator, strips away all user docs and revisions
 * for users that have not posted content to mappins, howtos, research or events
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
  const endpointsToCheck = ['mappins', 'howtos', 'research', 'events'] as const
  type ICheckedEndpoint = typeof endpointsToCheck[number]
  const allDocs: {
    [endpoint in ICheckedEndpoint]: firestore.QuerySnapshot<firestore.DocumentData>
  } = {} as any

  // Get list of users with howtos, mappins or events to retain data
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

/**
 *   WiP - If limiting seed size reduce the overall user list
 *   TODO - this will be too random and also end up with lots more howtos than anything else. Ideally should provide
 */
async function WiPReduceSeedSize(allDocs) {
  // specific list of data
  if (USE_SMALL_SAMPLE_SEED) {
    const sampleSize = 20
    const keptUsers = {}
    const shuffledHowtos = allDocs.howtos.docs
      .sort(() => 0.5 - Math.random())
      .slice(0, sampleSize)
    shuffledHowtos.forEach((doc) => (keptUsers[doc.data()._createdBy] = true))
    // Delete howtos
    const deletedHowtos = await batchDeleteDocs(
      allDocs.howtos.docs.filter((d) => !keptUsers[d.data()._createdBy]),
      '[Howtos Deleted]',
    )
    // Delete mappins
    const deletedMappins = await batchDeleteDocs(
      allDocs.mappins.docs.filter((d) => !keptUsers[d.id]),
      '[Mappins Deleted]',
    )
    // Delete events (TBD)
    // Delete research (TBD)
    return { deletedHowtos, deletedMappins, keptUsers }
  }
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
    'http://0.0.0.0:4003/emulator/v1/projects/community-platform-emulated' // http://[::1] for non-docker env
  return axios.delete(`${apiHost}/databases/(default)/documents/${endpoint}`)
}

/**
 * Use firebase tools to fully delete collection and subcollection from command-line tools
 * https://firebase.google.com/docs/firestore/solutions/delete-collections
 *
 * NOTE CC 2021-09-29 - Seems to have stopped working with current emulators (not sure why)
 * reverting to api method instead. Might be fixed with updated host endpoint used above and in firebase.json
 */
async function deleteCollectionCLI(endpoint: string) {
  // Note - whilst we are only operating on the emulator user will probably
  // still need to be logged into firebase to call
  // https://github.com/firebase/firebase-tools/issues/1940
  await firebase_tools.firestore
    .delete(endpoint, {
      recursive: true,
      yes: true,
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}

/**
 * Iterative method to delete all documents in a collection, by reading all documents in batches and deleting
 * Copied from https://github.com/firebase/snippets-node/blob/e5f6214059bdbc63f94ba6600f7f84e96325548d/firestore/main/index.js#L889-L921
 *
 * Note 1 - this is less efficient than the cli method, but also available outside of node environment
 * Note 2 - This fails to delete subcollections, and manual methods above added instead
 */
async function deleteCollectionIteratively(
  collectionPath: string,
  batchSize = 500,
) {
  const collectionRef = db.collection(collectionPath)
  const query = collectionRef.orderBy('__name__').limit(batchSize)
  return new Promise((resolve, reject) => {
    deleteQueryBatch(query, resolve).catch(reject)
  })
}

async function deleteQueryBatch(query, resolve) {
  const snapshot = await query.get()

  const batchSize = snapshot.size
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve()
    return
  }

  // Delete documents in a batch
  const batch = db.batch()
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref)
  })
  await batch.commit()

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(async () => {
    await deleteQueryBatch(query, resolve)
  })
}
