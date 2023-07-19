import * as functions from 'firebase-functions'
import { createNotificationEmails } from './createNotificationEmails'
import { db } from '../Firebase/firestoreDB'
import { DB_ENDPOINTS, IUserDB } from '../models'
import { EmailNotificationFrequency } from 'oa-shared'
import { withErrorAlerting } from '../alerting/errorAlerting'

const EMAIL_FUNCTION_MEMORY_LIMIT = '512MB'

exports.sendDaily = functions
  .runWith({ memory: EMAIL_FUNCTION_MEMORY_LIMIT })
  .pubsub // Trigger daily at 3pm PT (https://crontab.guru/#0_15_*_*_*)
  .schedule('0 15 * * *')
  .timeZone('Europe/Lisbon')
  .onRun((context) =>
    withErrorAlerting(context, () =>
      createNotificationEmails(EmailNotificationFrequency.DAILY),
    ),
  )

exports.sendWeekly = functions
  .runWith({ memory: EMAIL_FUNCTION_MEMORY_LIMIT })
  .pubsub // Trigger weekly at 3pm PT on Sunday (https://crontab.guru/#0_15_*_*_0)
  .schedule('0 15 * * 0')
  .timeZone('Europe/Lisbon')
  .onRun(async (context) =>
    withErrorAlerting(context, () =>
      createNotificationEmails(EmailNotificationFrequency.WEEKLY),
    ),
  )

exports.sendMonthly = functions
  .runWith({ memory: EMAIL_FUNCTION_MEMORY_LIMIT })
  .pubsub // Trigger monthly at 3pm PT on the first day of the month (https://crontab.guru/#0_15_1_*_*)
  .schedule('0 15 1 * *')
  .timeZone('Europe/Lisbon')
  .onRun(async (context) =>
    withErrorAlerting(context, () =>
      createNotificationEmails(EmailNotificationFrequency.MONTHLY),
    ),
  )

exports.sendOnce = functions
  .runWith({ memory: EMAIL_FUNCTION_MEMORY_LIMIT })
  .https.onCall(async (_, context) => {
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
