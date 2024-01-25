import type { IDiscussionComment, IUserPPDB } from 'src/models'

export const transformToUserComments = (
  comments: IDiscussionComment[],
  loggedInUser: IUserPPDB | null | undefined,
) =>
  toTree(
    comments.map((c) => ({
      ...c,
      isEditable: c._creatorId === loggedInUser?._id,
    })),
  )

const toTree = (comments: IDiscussionComment[]) => {
  const rootComments: IDiscussionComment[] = []
  const commentsById = {}

  // Traverse the comments and map them to their parent IDs
  for (const comment of comments) {
    commentsById[comment._id] = comment

    if (comment.parentCommentId) {
      const parentComment = commentsById[comment.parentCommentId]
      if (!parentComment.replies) {
        parentComment.replies = []
      }

      parentComment.replies.push(comment)
    }
  }

  // Extract the root comments (those with no parent IDs)
  for (const comment of comments) {
    if (!comment.parentCommentId) {
      rootComments.push(comment)
    }
  }

  return rootComments
}
