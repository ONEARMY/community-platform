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

  const toUser = toUserDoc.data()

  const toUserEmail = await getUserEmail(toUser._authID)

  if (!toUserDoc.exists || !toUserEmail) {
    console.error('Cannot get user info', { userName })
    await updateEmailedNotifications(toUserDoc, pendingNotifications, 'failed')
    return
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
    console.error('Error sending an email', { error, userName })
    await updateEmailedNotifications(toUserDoc, pendingNotifications, 'failed')
  }
}

export async function createEmailNotifications(
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
