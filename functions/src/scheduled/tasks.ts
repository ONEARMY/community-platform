/************ Scheduled tasks ***********************************************************
Scripts executed on a cron schedule, such as daily or weekly
https://firebase.google.com/docs/functions/schedule-functions
************************************************************************************/

import * as functions from 'firebase-functions'
import { BackupDatabase } from '../Firebase/firestoreDBExport'
import * as FirebaseSync from '../Firebase/firebaseSync'

/** Trigger tasks weekly on Sunday at 2am */
export const weeklyTasks = functions.pubsub
  .schedule('0 2 * * SUN')
  .onRun(async (context) => {
    functions.logger.log('[weeklyTasks] Start', context)
    const backupStatus = await BackupDatabase()
    functions.logger.log(backupStatus)
  })

/** Trigger tasks daily at 2am */
export const dailyTasks = functions.pubsub
  .schedule('0 2 * * *')
  .onRun(async (context) => {
    functions.logger.log('[dailyTasks] Start', context)
    await FirebaseSync.syncAll()
  })
