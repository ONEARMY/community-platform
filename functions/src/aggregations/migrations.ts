import * as functions from 'firebase-functions'
import { IHowtoDB, IResearchDB, DB_ENDPOINTS } from '../models'
import { db } from '../Firebase/firestoreDB'

let batch = db.batch()
const BATCH_SIZE = 200
let BATCH_COUNT = 0
const operations = { updated: [], skipped: [] }

/**
 * ====== DEPRECATED =======
 * One-off script to migrate user useful counts to individual objects
 * Once run this code will be deprecated, but retained in case
 * it can be used in future migrations
 */
export const userUseful = functions.https.onCall(
  async (dryRun: boolean, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called while authenticated.',
      )
    }

    try {
      const howtoUseful = {}
      const researchUseful = {}
      const allUsers = await db.collection(DB_ENDPOINTS.users)
      const snapshot = await allUsers.get()

      snapshot.forEach((user) => {
        const data = user.data()
        const howtoIds = Object.keys(data.votedUsefulHowtos ?? {})

        if (howtoIds.length > 0) {
          howtoIds.forEach((id) => {
            if (id in howtoUseful) {
              howtoUseful[id].push(user.id)
            } else {
              howtoUseful[id] = [user.id]
            }
          })
        }

        const researchIds = Object.keys(data.votedUsefulResearch ?? {})

        if (researchIds.length > 0) {
          researchIds.forEach((id) => {
            if (id in researchUseful) {
              researchUseful[id].push(user.id)
            } else {
              researchUseful[id] = [user.id]
            }
          })
        }
      })

      await batchGeneration(howtoUseful, 'howtos', dryRun)
      await batchGeneration(researchUseful, 'research', dryRun)

      if (!dryRun) {
        await batch.commit()
      }

      return {
        _dryRun: dryRun,
        operations,
        meta: {
          howtoUpdates: separateUseful(howtoUseful),
          researchUpdates: separateUseful(researchUseful),
        },
      }
    } catch (error) {
      console.error(error)
      throw new functions.https.HttpsError(
        'internal',
        'There was an error migrating useful.',
      )
    }
  },
)

function separateUseful(updates) {
  const docs = []
  const keys = Object.keys(updates)
  keys.forEach((key) => {
    docs.push({ id: key, votedUseful: updates[key] })
  })
  return docs
}

async function batchGeneration(
  usefulData: Record<string, any>,
  collection: 'howtos' | 'research',
  dryRun: boolean,
) {
  const docIds = Object.keys(usefulData)
  for (const id of docIds) {
    const ref = db.collection(DB_ENDPOINTS[collection]).doc(id)
    const doc = (await ref.get()).data()
    if (doc) {
      const update: Partial<IHowtoDB | IResearchDB> = {
        votedUsefulBy: usefulData[id],
        _modified: new Date().toISOString(),
      }
      operations.updated.push({ _id: id, ...update })
      batch.update(ref, update)

      BATCH_COUNT++
      // Commit batch in chunks to ensure firebase limits not hit
      if (BATCH_COUNT === BATCH_SIZE && !dryRun) {
        await batch.commit()
        await _sleep(1000)
        batch = db.batch()
        BATCH_COUNT = 0
      }
    } else {
      operations.skipped.push({ _id: id })
    }
  }
}

function _sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
