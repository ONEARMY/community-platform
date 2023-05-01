import { INotification, NotificationType } from '../../../src/models'
import { firebaseAuth } from '../Firebase/auth'
import { db } from '../Firebase/firestoreDB'
import { DB_ENDPOINTS, IUserDB, IPendingEmails } from '../models'

export const TEMPLATE_NAME = 'email_digest'

const getResourceLabelFromNotificationType = (type: NotificationType) => {
  switch (type) {
    case 'new_comment_research':
    case 'research_mention':
    case 'research_useful':
      return 'research'
    case 'howto_useful':
    case 'howto_mention':
    case 'new_comment':
      return 'how-to'
  }
}

const getActionTypeFromNotificationType = (type: NotificationType) => {
  switch (type) {
    case 'new_comment_research':
    case 'new_comment':
      return 'comment'
    case 'research_mention':
    case 'howto_mention':
      return 'mention'
    case 'research_useful':
    case 'howto_useful':
      return 'useful'
  }
}

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

export async function createNotificationEmails() {
  const pendingEmails = await db
    .collection(DB_ENDPOINTS.user_notifications)
    .doc('emails_pending')
    .get()

  for (const entry of Object.entries<IPendingEmails>(
    pendingEmails.data() ?? [],
  )) {
    const [_userId, { notifications: pendingNotifications }] = entry

    if (!pendingNotifications.length) continue

    const user = (await db
      .collection(DB_ENDPOINTS.users)
      .doc(_userId)
      .get()) as FirebaseFirestore.DocumentSnapshot<IUserDB>

    const email = await getUserEmail(_userId)

    if (!user.exists || !email) {
      console.error('Cannot get user info', { userId: _userId })
      await updateEmailedNotifications(user, pendingNotifications, 'failed')
      continue
    }

    let hasComments = false,
      hasUsefuls = false

    try {
      // Decorate notifications with additional fields for email template
      const templateNotifications = pendingNotifications.map((notification) => {
        const actionType = getActionTypeFromNotificationType(notification.type)

        const isComment = actionType === 'comment'
        const isMention = actionType === 'mention'
        const isUseful = actionType === 'useful'

        if (isComment || isMention) {
          hasComments = true
        }
        if (isUseful) {
          hasUsefuls = true
        }

        return {
          ...notification,
          resourceLabel: getResourceLabelFromNotificationType(
            notification.type,
          ),
          isComment,
          isMention,
          isUseful,
        }
      })

      const { displayName } = user.data()

      // Adding emails to this collection triggers an email notification to be sent to the user
      const sentEmailRef = await db.collection(DB_ENDPOINTS.emails).add({
        to: [email],
        template: {
          name: TEMPLATE_NAME,
          data: {
            displayName,
            hasComments,
            hasUsefuls,
            notifications: templateNotifications,
          },
        },
      })
      await updateEmailedNotifications(
        user,
        pendingNotifications,
        sentEmailRef.id,
      )
    } catch (error) {
      console.error('Error sending an email', { error, userId: _userId })
      await updateEmailedNotifications(user, pendingNotifications, 'failed')
    }
  }
}
