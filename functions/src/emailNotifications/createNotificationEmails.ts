import { EmailNotificationFrequency } from 'oa-shared'
import { INotification } from '../../../src/models'
import { firebaseAuth } from '../Firebase/auth'
import { db } from '../Firebase/firestoreDB'
import { DB_ENDPOINTS, IUserDB, IPendingEmails } from '../models'
import { getNotificationEmail } from './templates'
import { getUserEmail } from './utils'

const updateEmailedNotifications = async (
  user: FirebaseFirestore.DocumentSnapshot<IUserDB>,
  emailedNotifications: INotification[],
  emailField: string,
) => {
  const updatedNotifications = user.data().notifications.map((notification) => {
    if (
      emailedNotifications.some(
        (emailedNotification) => (emailedNotification._id = notification._id),
      )
    ) {
      return {
        ...notification,
        email: emailField,
      }
    }
    return notification
  })

  await user.ref
    .update({ notifications: updatedNotifications })
    .catch((error) => {
      throw new Error(
        `Error updating user notifications: ${JSON.stringify(error)}`,
      )
    })
}

// Create an email from a set of pending notifications for a user.
const handlePendingEmailEntry = async (
  userName: string,
  { notifications: pendingNotifications, emailFrequency }: IPendingEmails,
  targetFrequency?: EmailNotificationFrequency,
) => {
  if (
    !pendingNotifications.length ||
    (targetFrequency !== undefined && emailFrequency !== targetFrequency) ||
    emailFrequency === EmailNotificationFrequency.NEVER
  ) {
    return
  }

  const toUserDoc = (await db
    .collection(DB_ENDPOINTS.users)
    .doc(userName)
    .get()) as FirebaseFirestore.DocumentSnapshot<IUserDB>

  const toUser = toUserDoc.exists ? toUserDoc.data() : undefined
  const toUserEmail = toUser ? await getUserEmail(toUser._authID) : undefined

  if (!toUser || !toUserEmail) {
    await updateEmailedNotifications(toUserDoc, pendingNotifications, 'failed')
    throw new Error(`Cannot get user ${userName}`)
  }

  try {
    // Adding emails to this collection triggers an email notification to be sent to the user
    const sentEmailRef = await db.collection(DB_ENDPOINTS.emails).add({
      to: toUserEmail,
      message: getNotificationEmail(toUser, pendingNotifications),
    })

    await updateEmailedNotifications(
      toUserDoc,
      pendingNotifications,
      sentEmailRef.id,
    )
  } catch (error) {
    await updateEmailedNotifications(toUserDoc, pendingNotifications, 'failed')
    throw new Error(
      `Error sending an email to ${userName}: ${JSON.stringify(error)}`,
    )
  }
}

export async function createNotificationEmails(
  targetFrequency?: EmailNotificationFrequency,
) {
  const pendingEmails = await db
    .collection(DB_ENDPOINTS.user_notifications)
    .doc('emails_pending')
    .get()

  const pendingEmailEntries =
    Object.entries<IPendingEmails>(pendingEmails.data()) ?? []

  for (const entry of pendingEmailEntries) {
    await handlePendingEmailEntry(...entry, targetFrequency)
  }
}
