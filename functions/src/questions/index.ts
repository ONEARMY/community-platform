import * as functions from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { DB_ENDPOINTS } from '../models'
import { withErrorAlerting } from '../alerting/errorAlerting'
import type { IComment } from '../../../src/models'

/**
 * Whenever a question discussion is updated, this function updates the respective question metadata with commentCount and commentRecentDate.
 * This is useful for sorting questions server-side.
 */
exports.questionMetadata = functions.firestore
  .document('discussions')
  .onUpdate((change, context) => {
    withErrorAlerting(context, () => {
      const item = change.after.data()
      if (item.sourceType !== 'question') {
        return
      }

      let commentCount = 0
      let latestCommentDate: Date | undefined = undefined

      for (const comment of item.comments) {
        if (!comment) {
          continue
        }

        const summary = getCommentReplySummary(comment)
        commentCount += summary.commentCount

        if (
          !latestCommentDate ||
          latestCommentDate < summary.latestCommentDate
        ) {
          latestCommentDate = summary.latestCommentDate
        }
      }

      return firestore()
        .collection(DB_ENDPOINTS.questions)
        .doc(item.sourceId)
        .update({ commentCount, latestCommentDate })
    }),
      [change.before, change.after]
  })

// Recursive function that returns the reply count and latest reply date
function getCommentReplySummary(comment: IComment): {
  commentCount: number
  latestCommentDate: Date
} {
  let commentCount = 1 // Initialize with 1 for the current comment
  let latestCommentDate = new Date(comment._created) // Initialize with the current comment date;

  if (comment.replies) {
    // Recurse through replies
    for (const reply of comment.replies) {
      if (!reply) {
        continue
      }

      const summary = getCommentReplySummary(reply)
      commentCount += summary.commentCount

      if (latestCommentDate < summary.latestCommentDate) {
        latestCommentDate = summary.latestCommentDate
      }
    }
  }

  return { commentCount, latestCommentDate }
}
