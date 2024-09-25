import * as functions from 'firebase-functions'

import { db } from '../Firebase/firestoreDB'
import { DB_ENDPOINTS } from '../models'

import type { firestore } from 'firebase-admin'
import type { IDiscussion, IUserDB } from 'oa-shared/models'

/*********************************************************************
 * Side-effects to be carried out on various question updates, namely:
 * - update the _createdBy user stats with the question id
 *********************************************************************/

export const handleDiscussionUpdate = functions
  .runWith({ memory: '512MB' })
  .firestore.document(`${DB_ENDPOINTS.discussions}/{id}`)
  .onUpdate(async (change, context) => {
    await updateDocument(change)
  })

async function updateDocument(
  change: functions.Change<firestore.QueryDocumentSnapshot>,
) {
  const addedComments = getAddedComments(change)
  for (const addedComment of addedComments) {
    const commentId = addedComment._id
    const userSnapshot = await db
      .collection(DB_ENDPOINTS.users)
      .where('userName', '==', addedComment._creatorId)
      .get()
    const user = userSnapshot.docs[0].data() as IUserDB

    const _lastActive = Date.now().toString(16)
    const userCreatedComments = user.stats?.userCreatedComments ?? {}
    userCreatedComments[commentId] = addedComment.parentCommentId

    await userSnapshot.docs[0].ref.update({
      _lastActive,
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

    const _lastActive = Date.now().toString(16)
    const userCreatedComments = user.stats?.userCreatedComments ?? {}
    delete userCreatedComments[commentId]

    await userSnapshot.docs[0].ref.update({
      _lastActive,
      'stats.userCreatedComments': userCreatedComments,
    })
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
