import * as admin from 'firebase-admin'

const db = admin.firestore()

export const hitPostCounter = (postId: string) => {
  const ref = db.collection('discussion').doc(postId)
  // ref.set({viewCount: ref.viewCount + 1})
  // Update count in a transaction
  return db.runTransaction(t => {
    return t.get(ref).then(doc => {
      const new_count = doc.data().viewCount + 1;
      t.update(ref, { viewCount: new_count });
    });
  });

}