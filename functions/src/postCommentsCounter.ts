import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.firestore()

export const updateCommentsCount = () => {
  functions.firestore
    .document('discussions/{discussionId}/comments/{commentId}')
    .onWrite(event => {
      console.log(event)
      const discussionId = event.params.discussionId;
      // ref to the parent documents
      const docRef = db.collection('discussions').doc(discussionId)

      // get all comments and aggregate
      return docRef.collection('comments').get().then(querySnapshot => {
        // get the total comment count
        const commentCount = querySnapshot.size
        return docRef.update({_commentCount: commentCount})
      })
        .catch(err => console.log(err))
    })
}
