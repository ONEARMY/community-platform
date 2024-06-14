import { firestore } from 'firebase-admin'
import * as functions from 'firebase-functions'
import { uniq } from 'lodash'
import { NotificationType } from 'oa-shared'
import { db } from '../Firebase/firestoreDB'
import { DB_ENDPOINTS } from '../models'
import { getDiscussionCollectionName, randomID } from '../Utils'

import type {
  IUserDB,
  IDiscussion,
  INotification,
  IComment,
  IResearchDB,
} from '../models'

/*********************************************************************
 * Side-effects to be carried out on discussion updates, namely:
 * - Add new comments to user stats
 * - Remove deleted comments from user stats
 * - Send notifications for new comments
 *********************************************************************/

export const handleDiscussionUpdate = functions
  .runWith({ memory: '512MB' })
  .firestore.document(`${DB_ENDPOINTS.discussions}/{id}`)
  .onUpdate(async (change, context) => {
    try {
      await updateDocument(change)
    } catch (error) {
      console.error('Error in handleDiscussionUpdate:', error)
    }
  })

async function updateDocument(
  change: functions.Change<firestore.QueryDocumentSnapshot>,
) {
  // add new comments to user.stats.userCreatedComments
  const addedComments = getAddedComments(change)
  for (const addedComment of addedComments) {
    const commentId = addedComment._id
    const userSnapshot = await db
      .collection(DB_ENDPOINTS.users)
      .where('userName', '==', addedComment._creatorId)
      .get()
    const user = userSnapshot.docs[0].data() as IUserDB

    let userCreatedComments = user.stats?.userCreatedComments ?? {}
    userCreatedComments[commentId] = addedComment.parentCommentId

    await userSnapshot.docs[0].ref.update({
      'stats.userCreatedComments': userCreatedComments,
    })
  }

  // remove deleted comments from user.stats.userCreatedComments
  const removedComments = getRemovedComments(change)
  for (const removedComment of removedComments) {
    const commentId = removedComment._id
    const userSnapshot = await db
      .collection(DB_ENDPOINTS.users)
      .where('userName', '==', removedComment._creatorId)
      .get()
    const user = userSnapshot.docs[0].data() as IUserDB

    let userCreatedComments = user.stats?.userCreatedComments ?? {}
    delete userCreatedComments[commentId]

    await userSnapshot.docs[0].ref.update({
      'stats.userCreatedComments': userCreatedComments,
    })
  }

  const discussion = change.after.data() as IDiscussion
  await sendNotifications(discussion, addedComments)
}

async function sendNotifications(
  discussion: IDiscussion,
  addedComments: IComment[],
) {
  // loop all added comments and send notifications
  for (const comment of addedComments) {
    const sourceCollectionName = getDiscussionCollectionName(
      discussion.sourceType,
    )

    const commentCreatedBy = (
      await db
        .collection(DB_ENDPOINTS.users)
        .where('userName', '==', comment._creatorId)
        .get()
    ).docs[0]?.data() as IUserDB

    const parentComment = discussion.comments.find(
      ({ _id }) => _id === comment.parentCommentId,
    )

    switch (sourceCollectionName) {
      case 'research':
        const researchRef = db
          .collection(DB_ENDPOINTS[sourceCollectionName])
          .doc(discussion.primaryContentId)

        const research = (await researchRef.get()).data() as IResearchDB

        if (research) {
          const updateIndex = research.updates.findIndex(
            ({ _id }) => _id == discussion.sourceId,
          )
          const update = research.updates[updateIndex]

          const recipient = parentComment
            ? parentComment.creatorName
            : research._createdBy

          const collaborators = uniq(
            (update.collaborators ?? []).concat([recipient]),
          )

          for (const collaborator of collaborators) {
            await triggerNotification(
              'new_comment_discussion',
              collaborator,
              `/research/${research.slug}#update_${updateIndex}-comment:${comment._id}`,
              research.title,
              commentCreatedBy,
            )
          }
        }
        return
      default:
        const sourceDbRef = db
          .collection(DB_ENDPOINTS[sourceCollectionName])
          .doc(discussion.sourceId)

        const parentContent = (await sourceDbRef.get()).data()

        if (parentContent) {
          const recipient = parentComment
            ? parentComment.creatorName
            : parentContent._createdBy

          await triggerNotification(
            'new_comment_discussion',
            recipient,
            `/${sourceCollectionName}/${parentContent.slug}#comment:${comment._id}`,
            parentContent.title,
            commentCreatedBy,
          )
        }
    }
  }
}

async function triggerNotification(
  type: NotificationType,
  username: string,
  relevantUrl: string,
  title: string,
  triggeredBy: IUserDB,
) {
  if (triggeredBy) {
    // do not get notified when you're the one making a new comment or how-to useful vote
    if (triggeredBy.userName === username) {
      return
    }
    const newNotification: INotification = {
      _id: randomID(),
      _created: new Date().toISOString(),
      triggeredBy: {
        displayName: triggeredBy.displayName,
        userId: triggeredBy.userName,
      },
      relevantUrl,
      type,
      read: false,
      notified: false,
      title: title,
    }

    const userSnapshot = await db
      .collection(DB_ENDPOINTS.users)
      .where('userName', '==', username)
      .get()
    const user = userSnapshot.docs[0]?.data() as IUserDB
    if (user) {
      const notifications = user.notifications
        ? [...user.notifications, newNotification]
        : [newNotification]
      await userSnapshot.docs[0].ref.update({
        notifications: notifications,
      })
    }
  }
}

function getAddedComments(
  change: functions.Change<firestore.QueryDocumentSnapshot>,
) {
  const discussionBeforeChange = change.before.data() as IDiscussion
  const discussionAfterChange = change.after.data() as IDiscussion

  const addedComments = discussionAfterChange.comments.filter(
    (commentAfter) =>
      !discussionBeforeChange.comments.some(
        (commentBefore) => commentBefore._id === commentAfter._id,
      ),
  )
  return addedComments
}

function getRemovedComments(
  change: functions.Change<firestore.QueryDocumentSnapshot>,
) {
  const discussionBeforeChange = change.before.data() as IDiscussion
  const discussionAfterChange = change.after.data() as IDiscussion

  const removedComments = discussionBeforeChange.comments.filter(
    (commentBefore) =>
      !discussionAfterChange.comments.some(
        (commentAfter) => commentAfter._id === commentBefore._id,
      ),
  )
  return removedComments
}
