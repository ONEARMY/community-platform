import * as functions from 'firebase-functions'
import { auth } from 'firebase-admin'

/**
 * For requests coming from authenticated admins, request the email
 * for another user (not stored in DB so pulled from auth system)
 */
export const getUserEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called ' + 'while authenticated.',
    )
  }
  const { uid } = data
  // TODO - add server-side auth to check request coming from admin
  // (does still check clientside)
  try {
    const { email } = await auth().getUser(uid)
    return email
  } catch (error) {
    console.error(error)
    throw new functions.https.HttpsError('not-found', JSON.stringify(error))
  }
})
