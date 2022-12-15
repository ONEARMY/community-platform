import * as functions from 'firebase-functions'
import { IMigration } from './models'
import { up, down } from './provider'

/**
 * Lightweight utility scripts to manage data migrations, loosely designed around
 * https://github.com/sequelize/umzug
 *
 * Currently all migration code is handled through manual methods (e.g. db get/set commands)
 * however in the future could consider integrating something like https://kafkas.github.io/firecode/
 *
 */

/**
 * Use firebase task schedule to automatically enqueue a migration
 * task when functions are up and running
 */
export const schedule = functions
  .runWith({ maxInstances: 1, timeoutSeconds: 540 })
  .tasks.taskQueue({
    retryConfig: {
      maxAttempts: 1,
    },
    rateLimits: {
      maxConcurrentDispatches: 1,
    },
  })
  .onDispatch(async () => {
    const res = await up()
    console.log({ res })
  })

/**
 * Rollback most recent migration when triggered from db
 */
/** Watch changes to all user docs and apply aggregations */
export const rollback = functions.firestore
  // TODO - use db mapping when added to models
  .document(`migrations/{id}`)
  //   .document(`${DB_ENDPOINTS.users}/{id}`)
  .onUpdate(async (change) => {
    const before = change.before?.data() as IMigration | undefined
    const after = change.after?.data() as IMigration | undefined
    // Only run rollbacks when toggled
    if (after?._rollback && !before?._rollback) {
      const res = await down(after._id)
      console.log({ res })
    }
  })
