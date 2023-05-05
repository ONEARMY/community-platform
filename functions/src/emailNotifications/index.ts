import * as functions from 'firebase-functions'
import { createNotificationEmails } from './createEmail'
import { db } from '../Firebase/firestoreDB'
import { DB_ENDPOINTS, IUserDB } from '../models'
import { EmailNotificationFrequency } from 'oa-shared'

exports.sendDaily = functions.pubsub
  // Trigger daily at 5pm (https://crontab.guru/#0_17_*_*_*)
  .schedule('0 17 * * *')
  .onRun(async () => createNotificationEmails(EmailNotificationFrequency.DAILY))

exports.sendWeekly = functions.pubsub
  // Trigger weekly at 5pm on Sunday (https://crontab.guru/#0_17_*_*_0)
  .schedule('0 17 * * 0')
  .onRun(async () =>
    createNotificationEmails(EmailNotificationFrequency.WEEKLY),
  )

exports.sendMonthly = functions.pubsub
  // Trigger monthly at 5pm on the first day of the month (https://crontab.guru/#0_17_1_*_*)
  .schedule('0 17 1 * *')
  .onRun(async () =>
    createNotificationEmails(EmailNotificationFrequency.MONTHLY),
  )

exports.sendOnce = functions.https.onCall(async (_, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated.',
    )
  }
  // Validate user exists and has admin status before triggering function.
  const { uid: authId } = context.auth
  const user = await db
    .collection(DB_ENDPOINTS.users)
    .where('_authID', '==', authId)
    .get()

  if (user) {
    const { userRoles } = user.docs[0].data() as IUserDB
    if (userRoles?.some((role) => ['admin', 'super-admin'].includes(role))) {
      try {
        await createNotificationEmails()
        return 'OK'
      } catch (error) {
        console.error(error)
        throw new functions.https.HttpsError(
          'internal',
          'There was an error creating emails.',
        )
      }
    }
  }
  throw new functions.https.HttpsError(
    'permission-denied',
    'Emails can be triggered by admins only.',
  )
})
