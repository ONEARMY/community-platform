import { EmailNotificationFrequency } from 'oa-shared'
import { INotification } from '../../../src/models'
import { firebaseAuth } from '../Firebase/auth'
import { db } from '../Firebase/firestoreDB'
import { DB_ENDPOINTS, IUserDB, IPendingEmails } from '../models'
import { getEmailNotificationTemplate } from './getEmailNotificationTemplate'

const getUserEmail = async (uid: string): Promise<string | null> => {
  try {
    const { email } = await firebaseAuth.getUser(uid)
    return email
  } catch (error) {
    console.error('Unable to fetch user email', { error, userId: uid })
    return null
  }
}

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

  await user.ref.update({ notifications: updatedNotifications })
}

// Create emails from pending notifications. Filter by frequency (setting of email recipient) if defined.
export async function createEmailNotifications(
  frequency?: EmailNotificationFrequency,
) {
  const pendingEmails = await db
    .collection(DB_ENDPOINTS.user_notifications)
    .doc('emails_pending')
    .get()

  for (const entry of Object.entries<IPendingEmails>(
    pendingEmails.data() ?? [],
  )) {
    const [_userId, { notifications: pendingNotifications, emailFrequency }] =
      entry

    if (
      !pendingNotifications.length ||
      (frequency !== undefined && emailFrequency !== frequency) ||
      emailFrequency === EmailNotificationFrequency.NEVER
    )
      continue

    const toUserDoc = (await db
      .collection(DB_ENDPOINTS.users)
      .doc(_userId)
      .get()) as FirebaseFirestore.DocumentSnapshot<IUserDB>

    const toUser = toUserDoc.data()

    const toUserEmail = await getUserEmail(toUser._authID)

    if (!toUserDoc.exists || !toUserEmail) {
      console.error('Cannot get user info', { userId: _userId })
      await updateEmailedNotifications(
        toUserDoc,
        pendingNotifications,
        'failed',
      )
      continue
    }

    try {
      // Adding emails to this collection triggers an email notification to be sent to the user
      const sentEmailRef = await db.collection(DB_ENDPOINTS.emails).add({
        to: toUserEmail,
        message: getEmailNotificationTemplate(toUser, pendingNotifications),
      })

      await updateEmailedNotifications(
        toUserDoc,
        pendingNotifications,
        sentEmailRef.id,
      )
    } catch (error) {
      console.error('Error sending an email', { error, userId: _userId })
      await updateEmailedNotifications(
        toUserDoc,
        pendingNotifications,
        'failed',
      )
    }
  }
}
