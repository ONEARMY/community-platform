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

const getUserEmail = async (uid: string): Promise<string | undefined> => {
  try {
    const { email } = await firebaseAuth.getUser(uid)
    return email
  } catch (error) {
    return undefined
  }
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
    const user = await db.collection(DB_ENDPOINTS.users).doc(_userId).get()
    const email = await getUserEmail(_userId)

    if (!pendingNotifications.length || !email || !user.exists) continue

    let hasComments = false,
      hasUsefuls = false

    try {
      // Decorate notifications with additional fields for email template
      const templateNotifications = await Promise.all(
        pendingNotifications.map(async (notification) => {
          const triggeredByUser = await db
            .collection(DB_ENDPOINTS.users)
            .doc(notification.triggeredBy.userId)
            .get()

          const triggeredByUserName = triggeredByUser.exists
            ? (triggeredByUser.data() as IUserDB).userName
            : 'Unknown User'

          const actionType = getActionTypeFromNotificationType(
            notification.type,
          )

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
            triggeredBy: {
              ...notification.triggeredBy,
              userName: triggeredByUserName,
            },
            resourceLabel: getResourceLabelFromNotificationType(
              notification.type,
            ),
            isComment,
            isMention,
            isUseful,
          }
        }),
      )

      const { displayName, notifications } = user.data() as IUserDB

      // Adding emails to this collection triggers an email notification to be sent to the user
      await db.collection(DB_ENDPOINTS.emails).add({
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
      const updatedNotifications = notifications.map((n) => ({
        ...n,
        emailed: true,
      }))
      await user.ref.update({ notifications: updatedNotifications })
    } catch (error) {
      console.error('Error sending an email', error)
    }
  }
}
