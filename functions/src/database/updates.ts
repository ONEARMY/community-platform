import * as functions from 'firebase-functions'
import { DB_ENDPOINTS } from '../models'
import { db } from '../Firebase/firestoreDB'

let batch = db.batch()
const BATCH_SIZE = 200
let BATCH_COUNT = 0
const operations = { updated: [], skipped: [] }

/**
 * One-off script to set lastEditTimestamp for all docs
 * Once run this code will be deprecated, but retained for future reference
 */
export const lastEditTimestamp = functions.https.onCall(
  async (dryRun: boolean, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called while authenticated.',
      )
    }

    const logPrefix = dryRun ? '[DRY RUN] ' : ''

    try {
      functions.logger.info(`${logPrefix}Starting lastEditTimestamp Setting`)

      const howtoUpdates = []
      const researchUpdates = []
      const eventUpdates = []
      const howtos = await db.collection(DB_ENDPOINTS.howtos).get()
      const research = await db.collection(DB_ENDPOINTS.research).get()
      const events = await db.collection(DB_ENDPOINTS.events).get()

      if (!howtos.empty) {
        // Get howto updates
        howtos.forEach((ht) => {
          const data = ht.data()
          howtoUpdates.push({ id: ht.id, _lastEditTimestamp: data._modified })
        })
        await batchGeneration(howtoUpdates, 'howtos', dryRun, logPrefix)
      }

      if (!research.empty) {
        functions.logger.info(`${logPrefix}Research: ${research.docs.length}`)
        // Get research updates
        research.forEach((r) => {
          const data = r.data()
          const latestUpdate = data.updates
            ? data.updates[data.updates.length - 1]
            : null
          researchUpdates.push({
            id: r.id,
            _lastEditTimestamp: latestUpdate
              ? latestUpdate._created
              : data._modified,
          })
        })
        functions.logger.info(`${logPrefix}Starting research batch generation`)
        await batchGeneration(researchUpdates, 'research', dryRun, logPrefix)
      }

      if (!events.empty) {
        functions.logger.info(`${logPrefix}Events: ${events.docs.length}`)
        // Get event updates
        events.forEach((e) => {
          const data = e.data()
          eventUpdates.push({ id: e.id, _lastEditTimestamp: data._modified })
        })
        functions.logger.info(`${logPrefix}Starting event batch generation`)
        await batchGeneration(eventUpdates, 'events', dryRun, logPrefix)
      }

      return {
        _dryRun: dryRun,
        operations,
        meta: {
          howtoUpdates: howtoUpdates,
          researchUpdates: researchUpdates,
          eventUpdates: eventUpdates,
        },
      }
    } catch (error) {
      console.error(error)
      throw new functions.https.HttpsError(
        'internal',
        'There was an error setting last edit timestamps.',
      )
    }
  },
)

async function batchGeneration(
  updateData: Record<string, any>[],
  collection: 'events' | 'howtos' | 'research',
  dryRun: boolean,
  logPrefix: string,
) {
  functions.logger.info(
    `${logPrefix}Starting batch generation for ${updateData.length} ${collection}`,
  )
  for (let i = 0; i < updateData.length; i++) {
    const update = updateData[i]
    try {
      const ref = db.collection(DB_ENDPOINTS[collection]).doc(update.id)
      batch.update(ref, update)
      operations.updated.push({ ...update })

      BATCH_COUNT++
      // Commit batch in chunks to ensure firebase limits not hit
      if (BATCH_COUNT === BATCH_SIZE && !dryRun) {
        functions.logger.info(
          `${logPrefix}Committing a batch of ${collection} updates`,
        )
        await batch.commit()
        await _sleep(1000)
        batch = db.batch()
        BATCH_COUNT = 0
      }
    } catch (error) {
      functions.logger.info(
        `${logPrefix}Batch update failed for ${collection}: ${JSON.stringify(
          update,
        )}`,
      )
      operations.skipped.push({ ...update })
    }
  }

  if (BATCH_COUNT > 0 && !dryRun) {
    functions.logger.info(
      `${logPrefix}Committing a batch of ${collection} updates`,
    )
    await batch.commit()
    batch = db.batch()
    BATCH_COUNT = 0
  }
}

function _sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
