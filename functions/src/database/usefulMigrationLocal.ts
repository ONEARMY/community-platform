import * as admin from 'firebase-admin'
// The path to the credential file could also be passed through as an argument for the script
import * as serviceAccount from './prod-service-cred.json' // Make sure to download your Firebase admin SDK JSON file and provide its path here.

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
})

const db = admin.firestore()

;(async () => {
  console.log('Starting useful field update')
  const updates = {}

  const howtosRef = db.collection('v3_howtos')
  const usersRef = db.collection('v3_users')

  await howtosRef
    .get()
    .then(async (howtoSnapshot) => {
      for (const howto of howtoSnapshot.docs) {
        const votedUsefulBy = []
        await usersRef
          .where(`votedUsefulHowtos.${howto.id}`, '==', true)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((userDoc) => {
              const userData = userDoc.data()
              if (
                userData.userName !== 'DUP20230731_precious-plastic' &&
                userData.userName.indexOf('DUPLICATE') === -1
              ) {
                votedUsefulBy.push(userData.userName)
              }
            })
          })
          .catch((error) => {
            console.error('Useful update: Error getting users:', error)
          })
        if (votedUsefulBy.length) {
          const currentVotedUsefulBy = howto.data().votedUsefulBy ?? []

          // Use the set to remove duplicates
          const updatedUsefulBy = [
            ...new Set(currentVotedUsefulBy.concat(votedUsefulBy)),
          ]

          if (updatedUsefulBy.length !== currentVotedUsefulBy.length) {
            updates[howto.id] = {
              id: howto.id,
              name: howto.data().title,
              lastModified: howto.data()._modified,
              votedUsefulBy: currentVotedUsefulBy,
              updatedUsefulBy: updatedUsefulBy,
              votedUsefulByLength: currentVotedUsefulBy.length,
              currentVotedUsefulByLength: updatedUsefulBy.length,
            }

            await howtosRef
              .doc(howto.id)
              .update({
                votedUsefulBy: updatedUsefulBy,
              })
              .catch((error) => {
                console.error('Useful update: Error updating howto:', error)
              })
          }
        }
      }
      console.log('total updates:', Object.keys(updates).length)
      console.log(updates)
    })
    .catch((error) => {
      console.error('Useful update: Error getting howtos:', error)
    })
})()
