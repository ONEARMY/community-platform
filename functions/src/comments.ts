import { db } from './Firebase/firestoreDB'

export const syncCommentsCount = async context => {
  // ref to the parent document
  const discussionId = context.params.discussionId
  const docRef = db.collection('discussions').doc(discussionId)

  // get all comments and aggregate
  return docRef
    .collection('comments')
    .get()
    .then(querySnapshot => {
      return docRef.update({ _commentCount: querySnapshot.size })
    })
    .catch(err => console.log(err))
}
