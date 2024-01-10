import * as functions from 'firebase-functions'
import { createNotificationEmails } from './createNotificationEmails'
import { db } from '../Firebase/firestoreDB'
import { DB_ENDPOINTS, IUserDB } from '../models'
import { EmailNotificationFrequency } from 'oa-shared'
import { withErrorAlerting } from '../alerting/errorAlerting'
import * as moderationEmails from './createModerationEmails'
import * as submissionEmails from './createSubmissionEmails'
import * as supporterBadgeEmails from './supporterBadgeEmails'
import * as verifiedBadgeEmails from './verifiedBadgeEmails'
import { MEMORY_LIMIT_512_MB } from '../consts'
import { UserRole } from 'oa-shared/models'

exports.sendDaily = functions
  .runWith({ memory: MEMORY_LIMIT_512_MB })
  .pubsub // Trigger daily at 3pm PT (https://crontab.guru/#0_15_*_*_*)
  .schedule('0 15 * * *')
  .timeZone('Europe/Lisbon')
  .onRun((context) =>
    withErrorAlerting(context, () =>
      createNotificationEmails(EmailNotificationFrequency.DAILY),
    ),
  )

exports.sendWeekly = functions
  .runWith({ memory: MEMORY_LIMIT_512_MB })
  .pubsub // Trigger weekly at 3pm PT on Sunday (https://crontab.guru/#0_15_*_*_0)
  .schedule('0 15 * * 0')
  .timeZone('Europe/Lisbon')
  .onRun(async (context) =>
    withErrorAlerting(context, () =>
      createNotificationEmails(EmailNotificationFrequency.WEEKLY),
    ),
  )

exports.sendMonthly = functions
  .runWith({ memory: MEMORY_LIMIT_512_MB })
  .pubsub // Trigger monthly at 3pm PT on the first day of the month (https://crontab.guru/#0_15_1_*_*)
  .schedule('0 15 1 * *')
  .timeZone('Europe/Lisbon')
  .onRun(async (context) =>
    withErrorAlerting(context, () =>
      createNotificationEmails(EmailNotificationFrequency.MONTHLY),
    ),
  )

exports.sendOnce = functions
  .runWith({ memory: MEMORY_LIMIT_512_MB })
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
      if (
        userRoles?.some((role) =>
          [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(role),
        )
      ) {
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

/** Watch changes to all howto docs and trigger emails on moderation changes */
exports.sendHowToModerationEmail = moderationEmails.handleHowToModerationUpdate

/** Watch changes to all map pin docs and trigger emails on moderation changes */
exports.sendMapPinModerationEmail =
  moderationEmails.handleMapPinModerationUpdate

/** Watch new howto docs and trigger emails on creation */
exports.sendHowToSubmissionEmail = submissionEmails.handleHowToSubmission

/** Watch new map pin docs and trigger emails on creation */
exports.sendMapPinSubmissionEmail = submissionEmails.handleMapPinSubmission

/** Watch new message docs and trigger emails on creation */
exports.sendMessageEmail = submissionEmails.handleMessageSubmission

/** Watch new user docs and trigger emails on supporter */
exports.sendSupporterEmail = (
  supporterBadgeEmails as any
).handleUserSupporterBadgeUpdate

exports.sendVerifiedEmail = (
  verifiedBadgeEmails as any
).handleUserVerifiedBadgeUpdate
