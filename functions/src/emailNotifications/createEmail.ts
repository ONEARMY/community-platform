import { NotificationType } from '../../../src/models'
import { db } from '../Firebase/firestoreDB'
import { DB_ENDPOINTS, IUserDB, IPendingEmails } from '../models'

export const TEMPLATE_NAME = 'email_digest'

// Consider moving following two fns to handlebars
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
      // Aggregate list of notifications into comment and useful categories and decorate with
      // additional fields
      const { comments, usefuls } = await notifications.reduce(
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
              userName: triggeredByUserName,
            },
            resourceLabel: getResourceLabelFromNotificationType(
              notification.type,
            ),
            actionType: getActionTypeFromNotificationType(notification.type),
          }

          const { comments, usefuls } = await aggPromise

          if (['howto_useful', 'research_useful'].includes(notification.type)) {
            usefuls.push(templateNotification)
          }
          if (
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

      // Adding emails to this collection triggers an email notification to be sent to the user
      await db.collection(DB_ENDPOINTS.emails).add({
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
  }
}
