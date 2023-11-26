import * as functions from 'firebase-functions'
import { DB_ENDPOINTS } from 'oa-shared'
import { db } from '../Firebase/firestoreDB'
import { CONFIG } from '../config/config'

const PATREON_CLIENT_ID = CONFIG.integrations.patreon_client_id
const PATREON_CLIENT_SECRET = CONFIG.integrations.patreon_client_secret
const REDIRECT_URI = CONFIG.deployment.site_url + '/patreon'

const getCurrentPatreonUser = (accessToken: string) => {
  return fetch('https://www.patreon.com/api/oauth2/api/current_user', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log('Error fetching patreon user', err)
      throw new functions.https.HttpsError(
        'internal',
        'Patreon authentication failed.',
      )
    })
}

export const patreonAuth = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated.',
    )
  }
  //   Validate user exists and has admin status before triggering function.
  const { uid } = context.auth
  const user = await db.collection(DB_ENDPOINTS.users).doc(uid).get()
  if (!user.exists) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'User does not exist.',
    )
  }

  await fetch(
    `https://www.patreon.com/api/oauth2/token?code=${data.code}&grant_type=authorization_code&client_id=${PATREON_CLIENT_ID}&client_secret=${PATREON_CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )
    .then((res) => res.json())
    .then(async ({ access_token, refresh_token, expires_in }) => {
      const patreonUser = await getCurrentPatreonUser(access_token)
      try {
        await db
          .collection(DB_ENDPOINTS.users)
          .doc(uid)
          .update({
            patreon: {
              auth: {
                accessToken: access_token,
                refreshToken: refresh_token,
                expiresAt: expires_in,
              },
              user: patreonUser,
            },
          })
      } catch (err) {
        console.log('Error updating patreon user', err)
        throw new functions.https.HttpsError('internal', 'User update failed')
      }
    })
    .catch((err) => {
      console.log('Error authenticating patreon user', err)
      throw new functions.https.HttpsError(
        'internal',
        'Patreon authentication failed.',
      )
    })

  return { success: true }
})
