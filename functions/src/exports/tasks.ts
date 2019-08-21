/************ Cron tasks ***********************************************************
Use pubsub to automatically subscribe to messages sent from cron.
Add/change schedule from `./functions-cron/appengine/cron.yaml`
************************************************************************************/

import * as functions from 'firebase-functions'
import DHSite from '../DaveHakkensNL'
import { BackupDatabase } from '../Firebase/databaseBackup'

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
    await DHSite.updateDHUserIds()
  })
