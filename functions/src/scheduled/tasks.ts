/************ Scheduled tasks ***********************************************************
Scripts executed on a cron schedule, such as daily or weekly
https://firebase.google.com/docs/functions/schedule-functions
************************************************************************************/

import * as functions from 'firebase-functions'
import { BackupDatabase } from '../Firebase/firestoreDBExport'
import * as FirebaseSync from '../Firebase/firebaseSync'

/** Trigger tasks daily at 2am – https://crontab.guru/#0_2_*_*_* */
export const dailyTasks = functions.pubsub
  .schedule('0 2 * * *')
  .onRun(async (context) => {
    functions.logger.log('[dailyTasks] Start', context)
    const backupStatus = await BackupDatabase()
    functions.logger.log(backupStatus)
    await FirebaseSync.syncAll()
  })
