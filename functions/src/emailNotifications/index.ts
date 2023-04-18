import * as functions from 'firebase-functions'
import { createNotificationEmails } from './createEmail'

/** Trigger daily process to send any pending email notifications */
exports.sendDaily = functions.pubsub
  // Trigger daily at 5pm (https://crontab.guru/#0_17_*_*_*)
  .schedule('0 17 * * *')
  .onRun(async () => createNotificationEmails())
