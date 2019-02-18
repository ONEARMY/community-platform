import * as admin from 'firebase-admin'

const db = admin.firestore()

export const hitPostCounter = ({'_id': postId}) => {
  db.collection('discussions').doc(postId).get().then((data) => data.ref).then((ref) => {
    // Update count in a transaction
    return db.runTransaction(t => {
      return t.get(ref).then(doc => {
        const new_count = doc.data().viewCount + 1;
        t.update(ref, { viewCount: new_count });
      });
    });
  })

}