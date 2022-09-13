import * as functions from 'firebase-functions'
import { db } from '../Firebase/firestoreDB'
import {
  DB_ENDPOINTS,
  IDBDocChange,
  IHowtoDB,
  IResearchDB,
  IUserDB,
} from '../models'
import { backupUser } from './backupUser'

/*********************************************************************
 * Side-effects to be carried out on various user updates, namely:
 * - create user revision history
 * - update map pin location on change
 * - update howTo creator flag on change
 * - update userName and flag on any comments made by user
 *********************************************************************/
export const handleUserUpdates = functions.firestore
  .document(`${DB_ENDPOINTS.users}/{id}`)
  .onUpdate(async (change, context) => {
    await backupUser(change)
    await processHowToUpdates(change)
  })

async function processHowToUpdates(change: IDBDocChange) {
  const info = (change.after.exists ? change.after.data() : {}) as IUserDB
  const prevInfo = (change.before.exists ? change.before.data() : {}) as IUserDB
  // optional chaining (.?.) incase does not exists
  const prevCountryCode = prevInfo.location?.countryCode
  const newCountryCode = info.location?.countryCode
  const prevCountry = prevInfo.country
  const newCountry = info.country

  const didChangeCountry =
    prevCountryCode !== newCountryCode || prevCountry !== newCountry
  if (didChangeCountry) {
    // Update country flag in user's created howTos
    const country = newCountryCode ? newCountryCode : newCountry.toLowerCase()
    await updatePostsCountry(info._id, country)
  }

  const didChangeUserName = prevInfo.userName !== info.userName
  if (didChangeCountry || didChangeUserName) {
    await updateUserCommentsInfo({
      country: didChangeCountry
        ? newCountryCode
          ? newCountryCode
          : newCountry.toLowerCase()
        : undefined,
      newUserName: didChangeUserName ? info.userName : undefined,
      originalUserName: prevInfo.userName,
    })
  }
}

async function updatePostsCountry(userId: string, country: IUserDB['country']) {
  if (!userId || !country) {
    console.error('Missing information to set howToCountry')
    return false
  }
  console.log(
    "Updating howto's and researches from user",
    userId,
    'to country:',
    country,
  )

  // 1. Update howTos
  let updatedHowToCount = 0
  const howToQuerySnapshot = await db
    .collection(DB_ENDPOINTS.howtos)
    .where('_createdBy', '==', userId)
    .get()

  if (howToQuerySnapshot) {
    for (const doc of howToQuerySnapshot.docs) {
      try {
        await doc.ref.update({
          creatorCountry: country,
          _modified: new Date().toISOString(),
        })
        updatedHowToCount += 1
      } catch (error) {
        console.error('Error updating HowToCountry: ', error)
      }
    }
  } else {
    console.log('Error getting user howTo')
  }
  console.log('Successfully updated', updatedHowToCount, 'howTos!')

  // 2. Update Researches
  let updatedResearchCount = 0
  const researchQuerySnapshot = await db
    .collection(DB_ENDPOINTS.research)
    .where('_createdBy', '==', userId)
    .get()
  if (researchQuerySnapshot) {
    for (const doc of researchQuerySnapshot.docs) {
      try {
        await doc.ref.update({
          creatorCountry: country,
          _modified: new Date().toISOString(),
        })
        updatedResearchCount += 1
      } catch (error) {
        console.error('Error updating Research: ', error)
      }
    }
  } else {
    console.log('Error getting user researches')
    return false
  }
  console.log('Successfully updated', updatedResearchCount, 'researches!')

  return false
}

/**
 * Updates either `userName` or `country` in any comments made by the user on any HowTo or research
 */
async function updateUserCommentsInfo({
  originalUserName,
  newUserName,
  country,
}: {
  originalUserName: string
  newUserName?: string
  country?: string
}) {
  console.log('Updating comments by user', originalUserName)
  if (country) {
    console.log('with new country', country)
  }
  if (newUserName) {
    console.log('with new userName', newUserName)
  }

  // 1. Update howTo comments
  let count = 0
  const howToQuerySnapshot = await db.collection(DB_ENDPOINTS.howtos).get()

  if (howToQuerySnapshot) {
    for (const doc of howToQuerySnapshot.docs) {
      const howto = doc.data() as IHowtoDB
      if (
        howto.comments &&
        howto.comments.some(
          (comment) => comment.creatorName === originalUserName,
        )
      ) {
        let toUpdateCount = 0
        const updatedComments = howto.comments.map((comment) => {
          if (comment.creatorName !== originalUserName) return comment

          const updatedComment = {
            ...comment,
          }
          if (newUserName) {
            updatedComment.creatorName = newUserName
          }
          if (country) {
            updatedComment.creatorCountry = country
          }

          toUpdateCount += 1
          return updatedComment
        })

        try {
          await doc.ref.update({
            comments: updatedComments,
          })
          count += toUpdateCount
        } catch (error) {
          console.error('Error updating howTo comment: ', error)
        }
      }
    }
  }
  console.log('Successfully updated', count, 'howTo comments!')

  // 2. update Research comments
  count = 0
  const researchQuerySnapshot = await db.collection(DB_ENDPOINTS.research).get()

  if (researchQuerySnapshot) {
    for (const doc of researchQuerySnapshot.docs) {
      const research = doc.data() as IResearchDB
      if (
        research.updates &&
        research.updates.some(
          (update) =>
            update.comments &&
            update.comments.some(
              (comment) => comment.creatorName === originalUserName,
            ),
        )
      ) {
        let toUpdateCount = 0
        const updatedResearchUpdates = research.updates.map((update) => {
          if (
            !update.comments ||
            !update.comments.some(
              (comment) => comment.creatorName === originalUserName,
            )
          )
            return update

          const updatedComments = update.comments.map((comment) => {
            if (comment.creatorName !== originalUserName) return comment

            const updatedComment = {
              ...comment,
            }
            if (newUserName) {
              updatedComment.creatorName = newUserName
            }
            if (country) {
              updatedComment.creatorCountry = country
            }

            toUpdateCount += 1
            return updatedComment
          })

          return {
            ...update,
            comments: updatedComments,
          }
        })

        try {
          await doc.ref.update({
            updates: updatedResearchUpdates,
          })
          count += toUpdateCount
        } catch (error) {
          console.error('Error updating research comment: ', error)
        }
      }
    }
  }
  console.log('Successfully updated', count, 'research comments!')
}
