import * as functions from 'firebase-functions'
import { firebaseAuth } from '../Firebase/auth'

/**
 * For requests coming from authenticated admins, request the email
 * for another user (not stored in DB so pulled from auth system)
 */
export const getUserEmail = functions
  .runWith({
    memory: '512MB',
  })
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.runWith({ memory: '512MB' }).https.HttpsError(
        'failed-precondition',
        'The function must be called ' + 'while authenticated.',
      )
    }
    const { uid } = data
    // TODO - add server-side auth to check request coming from admin
    // (does still check clientside)
    try {
      const { email } = await firebaseAuth.getUser(uid)
      return email
    } catch (error) {
      console.error(error)
      throw new functions.runWith({ memory: '512MB' }).https.HttpsError(
        'not-found',
        JSON.stringify(error),
      )
    }
  })
