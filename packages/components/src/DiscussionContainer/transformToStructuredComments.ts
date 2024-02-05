import type { CommentWithReplies } from '../CommentList/CommentList'

type CommentWithRepliesParent = CommentWithReplies & {
  parentCommentId?: string
}

export const transformToTree = (comments: CommentWithRepliesParent[]) => {
  const rootComments: CommentWithRepliesParent[] = []
  const commentsById: any = {}

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
