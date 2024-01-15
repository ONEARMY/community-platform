import { MAX_COMMENT_LENGTH } from 'src/constants'
// import { updateDiscussionMetadata } from 'src/events/discussions.event'
import { logger } from 'src/logger'
import { firestore } from 'src/utils/firebase'
import { getUserCountry } from 'src/utils/getUserCountry'
import { hasAdminRights, randomID } from 'src/utils/helpers'

import type { IUserPPDB } from 'src/models'
import type {
  IDiscussion,
  IDiscussionComment,
} from 'src/models/discussion.models'

const DISCUSSIONS_COLLECTION = 'discussions'

const fetchOrCreateDiscussionBySource = async (
  sourceId: string,
  sourceType: IDiscussion['sourceType'],
) => {
  const result = await firestore
    .collection(DISCUSSIONS_COLLECTION)
    .where('sourceId', '==', sourceId)
    .get()
  if (result?.docs.length > 0) {
    return result.docs[0].data() as IDiscussion
  }

  // Create a new discussion
  return (await uploadDiscussion(sourceId, sourceType)) || null
}

const uploadDiscussion = async (
  sourceId: string,
  sourceType: IDiscussion['sourceType'],
): Promise<IDiscussion | undefined> => {
  const newDiscussion: IDiscussion = {
    _id: randomID(),
    sourceId,
    sourceType,
    comments: [],
  }

  const dbRef = firestore
    .collection(DISCUSSIONS_COLLECTION)
    .doc(newDiscussion._id)

  return _updateDiscussion(dbRef, newDiscussion)
}

const addComment = async (
  discussion: IDiscussion,
  text: string,
  user: IUserPPDB,
  commentId?: string,
): Promise<IDiscussion | undefined> => {
  try {
    const comment = text.slice(0, MAX_COMMENT_LENGTH).trim()

    if (user && comment) {
      const dbRef = firestore
        .collection(DISCUSSIONS_COLLECTION)
        .doc(discussion._id)

      const currentDiscussion = (await dbRef.get()).data() as IDiscussion

      if (!currentDiscussion) {
        throw new Error('Discussion not found')
      }

      const newComment: IDiscussionComment = {
        _id: randomID(),
        _created: new Date().toISOString(),
        _creatorId: user._id,
        creatorName: user.userName,
        creatorCountry: getUserCountry(user),
        text: comment,
        parentCommentId: commentId || null,
      }

      currentDiscussion.comments.push(newComment)

      return _updateDiscussion(dbRef, currentDiscussion)
    }
  } catch (err) {
    logger.error(err)
    throw new Error(err?.message)
  }
}

const editComment = async (
  discussion: IDiscussion,
  commentId: string,
  text: string,
  user: IUserPPDB,
): Promise<IDiscussion | undefined> => {
  try {
    const comment = text.slice(0, MAX_COMMENT_LENGTH).trim()

    if (user && comment) {
      const dbRef = firestore
        .collection(DISCUSSIONS_COLLECTION)
        .doc(discussion._id)

      const currentDiscussion = (await dbRef.get()).data() as IDiscussion

      if (currentDiscussion) {
        const targetComment = currentDiscussion.comments.find(
          (comment) => comment._id === commentId,
        )

        if (targetComment?._creatorId !== user._id) {
          throw new Error('Comment not editable by user')
        }

        currentDiscussion.comments = _findAndUpdateComment(
          user,
          currentDiscussion.comments,
          text,
          commentId,
        )

        return _updateDiscussion(dbRef, currentDiscussion)
      }
    }
  } catch (err) {
    logger.error(err)
    throw new Error(err?.message)
  }
}

const deleteComment = async (
  discussion: IDiscussion,
  commentId: string,
  user: IUserPPDB,
): Promise<IDiscussion | undefined> => {
  try {
    if (user) {
      const dbRef = firestore
        .collection(DISCUSSIONS_COLLECTION)
        .doc(discussion._id)

      const currentDiscussion = (await dbRef.get()).data() as IDiscussion

      if (currentDiscussion) {
        const targetComment = currentDiscussion.comments.find(
          (comment) => comment._id === commentId,
        )

        if (targetComment?._creatorId !== user._id) {
          throw new Error('Comment not editable by user')
        }

        currentDiscussion.comments = _findAndDeleteComment(
          user,
          currentDiscussion.comments,
          commentId,
        )

        return _updateDiscussion(dbRef, currentDiscussion)
      }
    }
  } catch (err) {
    logger.error(err)
    throw new Error(err?.message)
  }
}

const _findAndUpdateComment = (
  user: IUserPPDB,
  comments: IDiscussionComment[],
  newCommentText: string,
  commentId: string,
) => {
  return comments.map((comment) => {
    if (
      (comment._creatorId === user._id || hasAdminRights(user)) &&
      comment._id == commentId
    ) {
      comment.text = newCommentText
      comment._edited = new Date().toISOString()
    }
    return comment
  })
}

const _updateDiscussion = async (
  doc: firebase.default.firestore.DocumentReference<firebase.default.firestore.DocumentData>,
  discussion: IDiscussion,
) => {
  await doc.set(JSON.parse(JSON.stringify(discussion)))

  // updateDiscussionMetadata(discussion)

  return (await doc.get()).data() as IDiscussion
}

const _findAndDeleteComment = (
  user: IUserPPDB,
  comments: IDiscussionComment[],
  commentId: string,
) => {
  return comments.filter((comment) => {
    return !(
      (comment._creatorId === user._id || hasAdminRights(user)) &&
      comment._id === commentId
    )
  })
}

export const discussionsService = {
  fetchOrCreateDiscussionBySource,
  uploadDiscussion,
  addComment,
  editComment,
  deleteComment,
}
