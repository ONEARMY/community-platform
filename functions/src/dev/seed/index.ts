import { Request, Response } from "express"
// (note - typings don't currently exist for firebase-tools: https://github.com/firebase/firebase-tools/issues/2378)
import * as firebase_tools from 'firebase-tools'
import { DB_ENDPOINTS } from "../../models"
import { db } from "../../Firebase/firestoreDB"
import { splitArrayToChunks } from "../../Utils/data.utils"
import { firestore } from "firebase-admin"


/**
 * Script used to generate a clean seed of seed data for use in development
 * 
 * Given a full dump of site data in the emulator, strips away all user docs and revisions
 * for users that have not posted content to mappins, howtos, research or events
 * (basically anywhere their profile might be linked from)
 */
export async function cleanSeedData(req: Request, res: Response) {
    const dbCollections = await db.listCollections()
    const dbEndpoints = dbCollections.map(c => c.id)
    const expectedEndpoints = Object.values(DB_ENDPOINTS)
    // Delete collections not in use
    for (const endpoint of dbEndpoints) {
        if (!expectedEndpoints.includes(endpoint)) {
            await deleteCollectionCLI(endpoint)
        }
    }
    // Get list of users with howtos, mappins or events to retain data
    const keptUsers = {}
    const endpointsToCheck = ['mappins', 'howtos', 'research', 'events'] as const
    for (const endpoint of endpointsToCheck) {
        const mappedEndpoint = DB_ENDPOINTS[endpoint]
        if (mappedEndpoint) {
            const docs = await db.collection(mappedEndpoint).get()
            docs.forEach(doc => {
                switch (endpoint) {
                    case 'mappins':
                        keptUsers[doc.id] = true
                        break;
                    default:
                        const data = doc.data();
                        keptUsers[data._createdBy] = true
                }
            })
        }
    }
    // Delete non-required users in batches 
    const deletedUsers = await deleteQueryDocs(db.collection(DB_ENDPOINTS.users), '[Users Deleted]', (doc) => !keptUsers[doc.data()._id])
    // Delete nested revision docs (TODO - should add filter to ensure doc ref is a subcollection of users)
    const deletedRevisions = await deleteQueryDocs(db.collectionGroup('revisions'), '[Revisions Deleted]', (doc) => !keptUsers[doc.data()._id])
    // Delete nested stats docs
    const deletedStats = await deleteQueryDocs(db.collectionGroup('stats'), '[Stats Deleted]', (doc) => !keptUsers[doc.data()._id])
    res.status(200).send({ keptUsers, deletedUsers, deletedRevisions, deletedStats })
}

async function deleteQueryDocs(
    query: firestore.CollectionGroup<firestore.DocumentData> | firestore.CollectionReference<firestore.DocumentData>,
    logPrefix = '[Deleted]',
    filterFn = (doc: firestore.QueryDocumentSnapshot) => false) {
    const queryResults = await query.get()
    const filteredRefs = queryResults.docs.filter(doc => filterFn(doc)).map(doc => doc.ref)
    const chunks = splitArrayToChunks(filteredRefs, 500)
    let currentChunk = 0
    const totalChunks = chunks.length
    for (const chunk of chunks) {
        const batch = db.batch()
        for (const ref of chunk) {
            batch.delete(ref)
        }
        await batch.commit()
        currentChunk++
        console.log(`${logPrefix} [${currentChunk * 500}] of ${totalChunks * 500}`)
        await _waitForNextTick()
    }
    return filteredRefs
}

/** Simple wrapper function to avoid cascading knock-ons for triggered functions etc. */
function _waitForNextTick(): Promise<void> {
    return new Promise((resolve) => process.nextTick(() => resolve()))
}

/**
 * Use firebase tools to fully delete collection and subcollection from command-line tools
 * https://firebase.google.com/docs/firestore/solutions/delete-collections
 */
async function deleteCollectionCLI(endpoint: string) {
    // Note - whilst we are only operating on the emulator user will probably
    // still need to be logged into firebase to call
    // https://github.com/firebase/firebase-tools/issues/1940
    await firebase_tools.firestore.delete(endpoint, {
        recursive: true,
        yes: true,
    });
}


/**
 * Iterative method to delete all documents in a collection, by reading all documents in batches and deleting
 * Copied from https://github.com/firebase/snippets-node/blob/e5f6214059bdbc63f94ba6600f7f84e96325548d/firestore/main/index.js#L889-L921
 *
 * Note 1 - this is less efficient than the cli method, but also available outside of node environment
 * Note 2 - This fails to delete subcollections, and so more work required to make complete
 */
async function deleteCollectionIteratively(collectionPath: string, batchSize = 500) {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(batchSize);
    return new Promise((resolve, reject) => {
        deleteQueryBatch(query, resolve).catch(reject);
    });
}

async function deleteQueryBatch(query, resolve) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
        // When there are no documents left, we are done
        resolve();
        return;
    }

    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(async () => {
        await deleteQueryBatch(query, resolve);
    });
}
