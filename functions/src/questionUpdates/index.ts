import { firestore } from 'firebase-admin'
import * as functions from 'firebase-functions'

import { db } from '../Firebase/firestoreDB'
import { DB_ENDPOINTS } from '../models'
import { IQuestionDB } from 'oa-shared/models/questions'
import { IUserDB } from 'oa-shared/models/user'

/*********************************************************************
 * Side-effects to be carried out on various question updates, namely:
 * - update the _createdBy user stats with the question id
 *********************************************************************/
export const handleQuestionCreate = functions
  .runWith({ memory: '512MB' })
  .firestore.document(`${DB_ENDPOINTS.questions}/{id}`)
  .onCreate(async (docSnapshot, context) => {
    await updateDocument(docSnapshot)
  })

export const handleQuestionUpdate = functions
  .runWith({ memory: '512MB' })
  .firestore.document(`${DB_ENDPOINTS.questions}/{id}`)
  .onUpdate(async (change, context) => {
    await updateDocument(change.before)
  })

export const handleQuestionDelete = functions
  .runWith({ memory: '512MB' })
  .firestore.document(`${DB_ENDPOINTS.questions}/{id}`)
  .onDelete(async (docSnapshot, context) => {
    await deleteDocument(docSnapshot)
  })

async function updateDocument(docSnapshot: firestore.QueryDocumentSnapshot) {
  const question = docSnapshot.data() as IQuestionDB
  const question_id = question._id

  const userSnapshot = await db
    .collection(DB_ENDPOINTS.users)
    .where('userName', '==', question._createdBy)
    .get()
  const user = userSnapshot.docs[0].data() as IUserDB

  let userCreatedQuestions = user.stats?.userCreatedQuestions ?? {}
  userCreatedQuestions[question_id] = question.moderation

  await userSnapshot.docs[0].ref.update({
    'stats.userCreatedQuestions': userCreatedQuestions,
  })
}

async function deleteDocument(docSnapshot: firestore.QueryDocumentSnapshot) {
  const question = docSnapshot.data() as IQuestionDB
  const question_id = question._id

  const userSnapshot = await db
    .collection(DB_ENDPOINTS.users)
    .where('userName', '==', question._createdBy)
    .get()
  const user = userSnapshot.docs[0].data() as IUserDB

  let userCreatedQuestions = user.stats?.userCreatedQuestions ?? {}
  delete userCreatedQuestions[question_id]

  await userSnapshot.docs[0].ref.update({
    'stats.userCreatedQuestions': userCreatedQuestions,
  })
}
