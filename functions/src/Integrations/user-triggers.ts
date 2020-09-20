import * as functions from 'firebase-functions'
import { db } from '../Firebase/firestoreDB'

export const handleUserChanges = functions.firestore
  .document('v3_users/{id}')
  .onWrite(async (change, context) => {

    const info = change.after.exists ? change.after.data() : null
    const prevInfo = change.before.exists ? change.before.data() : null

    const prevCountryCode = (prevInfo.location && prevInfo.location.countryCode) ? prevInfo.location.countryCode : null
    const newCountryCode = (info.location && info.location.countryCode) ? info.location.countryCode : null
    const prevCountry = prevInfo.country ? prevInfo.country : null
    const newCountry = info.country ? info.country : null

    if(prevCountryCode !== newCountryCode || prevCountry !== newCountry){
      const country = newCountryCode ? newCountryCode : newCountry.toLowerCase()
      updateHowTosCountry(info._id, country);
    }
  })

async function updateHowTosCountry(userId, country){
  if (!userId || !country) {
    console.error('Missing information to set howToCountry')
    return false
  }
  console.log('Update ', userId, ' moved to :', country)

  const querySnapshot = await db.collection('v3_howtos').where("_createdBy", "==", userId).get();

  if(querySnapshot){
    querySnapshot.forEach(doc => {
      console.log('Updating howTo ', doc.data()._id, 'to', country);
      doc.ref.update({'creatorCountry': country}).then( () => {
        console.log("Document successfully updated!");
        return true
      }).catch( error => {
        console.error("Error updating HowToCountry: ", error);
        return false
      });
    });
  } else {
    console.log('Error getting user howTos: ', e);
    return false
  }
  return false
}
