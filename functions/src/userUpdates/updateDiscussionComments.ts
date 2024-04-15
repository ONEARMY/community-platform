import { DB_ENDPOINTS } from 'oa-shared'

import { db } from '../Firebase/firestoreDB'
import { hasKeyDetailsChanged } from './hasKeyDetailsChanged'

import type { IDiscussion, IUserDB } from '../models'

export const updateDiscussionComments = async (
  prevUser: IUserDB,
  user: IUserDB,
) => {
  if (!hasKeyDetailsChanged(prevUser, user)) return

  let updatedCommentCount = 0

  const { _id, badges, location } = user
  const userDetails = {
    creatorCountry: location?.countryCode || '',
    isUserVerified: !!badges?.verified,
    isUserSupporter: !!badges?.supporter,
  }

  const snapshot = await db
    .collection(DB_ENDPOINTS.discussions)
    .where('contributorIds', 'array-contains', _id)
    .get()

  for (const doc of snapshot.docs) {
    const discussion = doc.data() as IDiscussion

    const comments = discussion.comments.map((comment) => {
      if (comment._creatorId !== _id) return comment

      updatedCommentCount++
      return {
        ...comment,
        ...userDetails,
      }
    })

    await doc.ref.update({ comments })
  }
  console.log(`Updated ${updatedCommentCount} discussion comments`)
}
