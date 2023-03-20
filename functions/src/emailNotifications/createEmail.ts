import { NotificationType } from '../../../src/models'
import { firebaseAuth } from '../Firebase/auth'
import { db } from '../Firebase/firestoreDB'
import { DB_ENDPOINTS, IUserDB, IPendingEmails } from '../models'

const EMAIL_COLLECTION = 'emails'
const TEMPLATE_NAME = 'email_digest'

// move to handlebars functions if possible
const getResourceTypeFromNotificationType = (type: NotificationType) => {
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
  const notificationEndpoint = DB_ENDPOINTS.user_notifications
  const pendingEmails = await db
    .collection(notificationEndpoint)
    .doc('emails_pending')
    .get()

  Object.entries(pendingEmails.data()).forEach(
    async ([_userId, value]: [string, IPendingEmails]) => {
      const user = await db.collection[DB_ENDPOINTS.users].doc(_userId).get()
      if (user.exists) {
        const { displayName } = user.data() as IUserDB
        const { comments, usefuls } = await value.notifications.reduce(
          async (aggPromise, notification) => {
            const triggeredByUser = await db
              .collection(DB_ENDPOINTS.users)
              .doc(notification.triggeredBy.userId)
              .get()
            const triggeredByUserName = triggeredByUser.exists
              ? (triggeredByUser.data() as IUserDB).userName
              : undefined

            const templateNotification = {
              ...notification,
              triggeredBy: {
                ...notification.triggeredBy,
                // would be nice if we could build this into the notification
                userUrl: `https://community.preciousplastic.com/u/${triggeredByUserName}`,
              },
              resourceType: getResourceTypeFromNotificationType(
                notification.type,
              ),
              actionType: getActionTypeFromNotificationType(notification.type),
            }

            let { comments, usefuls } = await aggPromise

            // should we check if notif is read? update notified field?
            if (
              ['howto_useful', 'research_useful'].includes(notification.type)
            ) {
              usefuls.push(templateNotification)
            } else if (
              [
                'new_comment',
                'howto_mention',
                'new_comment_research',
                'research_mention',
              ].includes(notification.type)
            ) {
              comments.push(templateNotification)
            }
            return { comments, usefuls }
          },
          Promise.resolve({ comments: [], usefuls: [] }),
        )
        db.collection(EMAIL_COLLECTION).add({
          toUids: [_userId],
          template: {
            name: TEMPLATE_NAME,
            data: {
              displayName,
              comments,
              usefuls,
            },
          },
        })
      }
    },
  )
}
