import { NotificationType } from '../../../src/models'
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

export async function createNotificationEmails() {
  const pendingEmails = await db
    .collection(DB_ENDPOINTS.user_notifications)
    .doc('emails_pending')
    .get()

  for (const entry of Object.entries<IPendingEmails>(
    pendingEmails.data() ?? [],
  )) {
    const [_userId, { notifications }] = entry

    if (!notifications.length) continue

    const user = await db.collection(DB_ENDPOINTS.users).doc(_userId).get()

    if (user.exists) {
      const { displayName } = user.data() as IUserDB
      let hasComments = false,
        hasUsefuls = false

      // Decorate notifications with additional fields for email template
      const templateNotifications = await Promise.all(
        notifications.map(async (notification) => {
          const triggeredByUser = await db
            .collection(DB_ENDPOINTS.users)
            .doc(notification.triggeredBy.userId)
            .get()

          const triggeredByUserName = triggeredByUser.exists
            ? (triggeredByUser.data() as IUserDB).userName
            : undefined

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

      const { email } = await firebaseAuth.getUser(_userId)

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
    }
  }
}
