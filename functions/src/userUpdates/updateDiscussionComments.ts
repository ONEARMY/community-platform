import { DB_ENDPOINTS } from 'oa-shared'

import { db } from '../Firebase/firestoreDB'
import { hasKeyDetailsChanged } from './hasKeyDetailsChanged'

import type { IDiscussion, IUserDB } from '../models'

export const updateDiscussionComments = async (
  prevUser: IUserDB,
  user: IUserDB,
) => {
  if (!hasKeyDetailsChanged(prevUser, user)) return

  const snapshot = await db
    .collection(DB_ENDPOINTS.discussions)
    .where('contributorIds', 'array-contains', user._id)
    .get()

  if (!snapshot.empty) {
    const { _id, badges, userImage, location } = user
    const creatorImage = getCreatorImage(userImage)

    const userDetails = {
      creatorCountry: location?.countryCode || '',
      creatorImage,
      isUserVerified: !!badges?.verified,
      isUserSupporter: !!badges?.supporter,
    }

    let updatedCommentCount = 0

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
    return console.log(`Updated ${updatedCommentCount} discussion comments`)
  }
}

const getCreatorImage = (userImage: IUserDB['userImage']) => {
  if (userImage && userImage.downloadUrl) {
    return userImage.downloadUrl
  }
  return null
}
