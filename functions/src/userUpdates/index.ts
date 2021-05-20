import * as functions from 'firebase-functions'
import { db } from '../Firebase/firestoreDB'
import { DB_ENDPOINTS, IDBDocChange, IUserDB, IHowtoDB } from '../models'
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
  const info: IUserDB = change.after.exists ? change.after.data() : {}
  const prevInfo: IUserDB = change.before.exists ? change.before.data() : {}
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
    await updateHowTosComments({
      userId: info._id,
      country: didChangeCountry
        ? newCountryCode
          ? newCountryCode
          : newCountry.toLowerCase()
        : undefined,
      userName: didChangeUserName ? info.userName : undefined,
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
  console.log('Update', userId, 'moved to :', country)

  const querySnapshot = await db
    .collection(DB_ENDPOINTS.howtos)
    .where('_createdBy', '==', userId)
    .get()

  if (querySnapshot) {
    querySnapshot.forEach(doc => {
      console.log('Updating howTo ', doc.data()._id, 'to', country)
      doc.ref
        .update({
          creatorCountry: country,
          _modified: new Date().toISOString(),
        })
        .then(() => {
          console.log('Document successfully updated!')
          return true
        })
        .catch(error => {
          console.error('Error updating HowToCountry: ', error)
          return false
        })
    })
  } else {
    console.log('Error getting user howTo')
    return false
  }
  return false
}

/**
 * Updates either `userName` or `country` in any comments made by the user on any HowTo
 */
async function updateHowTosComments({
  userId,
  userName,
  country,
}: {
  userId: string
  userName?: string
  country?: string
}) {
  console.log('Updating comments by user', userId)
  const querySnapshot = await db
    .collection(DB_ENDPOINTS.howtos)
    .where('comments', 'array-contains', { _creatorId: userId })
    .get()

  let count = 0
  if (querySnapshot) {
    querySnapshot.forEach(doc => {
      const howto = doc.data() as IHowtoDB
      if (howto.comments) {
        howto.comments.forEach(comment => {
          if (comment._creatorId === userId) {
            const updatedComment = {
              ...comment,
            }
            if (userName) {
              updatedComment.creatorName = userName
            }
            if (country) {
              updatedComment.creatorCountry = country
            }

            doc.ref
              .update(updatedComment)
              .then(() => {
                count += 1
              })
              .catch(error => {
                console.error('Error updating comment: ', error)
              })
          }
        })
      }
    })
  }
  console.log('Successfully updated', count, 'comments!')
}
