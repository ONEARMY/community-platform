/************ Scheduled tasks ***********************************************************
Scripts executed on a cron schedule, such as daily or weekly
https://firebase.google.com/docs/functions/schedule-functions
************************************************************************************/

import * as functions from 'firebase-functions'
import { BackupDatabase } from '../Firebase/databaseBackup'
import * as FirebaseSync from '../Firebase/firebaseSync'

/** Trigger tasks weekly on Sunday at 2am */
export const weeklyTasks = functions.pubsub
  .schedule('0 2 * * SUN')
  .onRun(async (context) => {
    console.log('weekly tick', context)
    const backupStatus = await BackupDatabase()
    console.log(backupStatus)
  })

/** Trigger tasks daily at 2am */
export const dailyTasks = functions.pubsub
  .schedule('0 2 * * *')
  .onRun(async (context) => {
    console.log('daily tick', context)
    await FirebaseSync.syncAll()
  })
