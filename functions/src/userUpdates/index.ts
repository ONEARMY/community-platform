import * as functions from 'firebase-functions'
import { db } from '../Firebase/firestoreDB'
import { IUserDB, IDBDocChange } from '../models'

/*********************************************************************
 * Side-effects to be carried out on various user updates, namely:
 * - create user revision history
 * - update map pin location on change
 * - update howTo creator flag on change
 *********************************************************************/
export const handleUserUpdates = functions.firestore
  .document('v3_users/{id}')
  .onUpdate(async (change, context) => {
    await processCountryUpdates(change)
  })

async function processCountryUpdates(change: IDBDocChange) {
  const info = change.after.exists ? change.after.data() : {}
  const prevInfo = change.before.exists ? change.before.data() : {}
  // optional chaining (.?.) incase does not exists
  const prevCountryCode = prevInfo.location?.countryCode
  const newCountryCode = info.location?.countryCode
  const prevCountry = prevInfo.country
  const newCountry = info.country
  if (prevCountryCode !== newCountryCode || prevCountry !== newCountry) {
    const country = newCountryCode ? newCountryCode : newCountry.toLowerCase()
    return updateHowTosCountry(info._id, country)
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
  console.log('Update ', userId, ' moved to :', country)

  const querySnapshot = await db
    .collection('v3_howtos')
    .where('_createdBy', '==', userId)
    .get()

  if (querySnapshot) {
    querySnapshot.forEach(doc => {
      console.log('Updating howTo ', doc.data()._id, 'to', country)
      doc.ref
        .update({ creatorCountry: country })
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
