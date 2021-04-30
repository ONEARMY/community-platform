/************ Cron tasks ***********************************************************
Use pubsub to automatically subscribe to messages sent from cron.
Add/change schedule from `./functions-cron/appengine/cron.yaml`
************************************************************************************/

import * as functions from 'firebase-functions'
import { BackupDatabase } from '../Firebase/databaseBackup'
import * as FirebaseSync from '../Firebase/firebaseSync'

export const weeklyTasks = functions.pubsub
  .topic('weekly-tick')
  .onPublish(async (message, context) => {
    console.log('weekly tick', message, context)
    const backupStatus = await BackupDatabase()
    console.log(backupStatus)
  })

export const dailyTasks = functions.pubsub
  .topic('daily-tick')
  .onPublish(async (message, context) => {
    console.log('daily tick', message, context)
    await FirebaseSync.syncAll()
  })
