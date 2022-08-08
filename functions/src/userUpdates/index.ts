import * as functions from 'firebase-functions'
import { db } from '../Firebase/firestoreDB'
import { DB_ENDPOINTS, IDBDocChange, IHowtoDB, IUserDB } from '../models'
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
    await updateHowTosCountry(info._id, country)
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

async function updateHowTosCountry(
  userId: string,
  country: IUserDB['country'],
) {
  if (!userId || !country) {
    console.error('Missing information to set howToCountry')
    return false
  }
  console.log("Updating howto's from user", userId, 'to country:', country)
  let count = 0

  const querySnapshot = await db
    .collection(DB_ENDPOINTS.howtos)
    .where('_createdBy', '==', userId)
    .get()

  if (querySnapshot) {
    querySnapshot.forEach((doc) => {
      doc.ref
        .update({
          creatorCountry: country,
          _modified: new Date().toISOString(),
        })
        .then(() => {
          count += 1
          return true
        })
        .catch((error) => {
          console.error('Error updating HowToCountry: ', error)
          return false
        })
    })
  } else {
    console.log('Error getting user howTo')
    return false
  }
  console.log('Successfully updated', count, 'howTos!')
  return false
}

/**
 * Updates either `userName` or `country` in any comments made by the user on any HowTo
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
  const querySnapshot = await db.collection(DB_ENDPOINTS.howtos).get()

  let count = 0
  if (querySnapshot) {
    for (const doc of querySnapshot.docs) {
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
          console.error('Error updating comment: ', error)
        }
      }
    }
  }
  console.log('Successfully updated', count, 'comments!')
}
