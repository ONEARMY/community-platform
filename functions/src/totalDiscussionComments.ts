import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

exports.aggregateComments = functions.firestore
  .document('discussions/{discussionId}/comments/{commentId}')
  .onWrite(event => {
    const discussionId = event.params.discussionId;
    // ref to the parent documents
    const docRef = admin.firestore().collection('discussions').doc(discussionId)

    // get all comments and aggregate
    return docRef.collection('comments').get().then(querySnapshot => {
        // get the total comment count
        const commentCount = querySnapshot.size
        return docRef.update({_commentCount: commentCount})
      })
      .catch(err => console.log(err))
  })
