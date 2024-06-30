import * as functions from 'firebase-functions'
import {
  DB_ENDPOINTS,
  PatreonMembershipAttributes,
  PatreonTierAttributes,
  PatreonUser,
  PatreonUserAttributes,
} from '@onearmy.apps/shared'
import { db } from '../Firebase/firestoreDB'
import { CONFIG } from '../config/config'
import { IUserDB } from '../models'
import { MEMORY_LIMIT_512_MB } from '../consts'

const PATREON_CLIENT_ID = CONFIG.integrations.patreon_client_id
const PATREON_CLIENT_SECRET = CONFIG.integrations.patreon_client_secret
const REDIRECT_URI = CONFIG.deployment.site_url + '/patreon'

// See https://www.patreon.com/one_army/membership
const PP_SUPPORTER_TIER_ID = '9413328'
const PK_SUPPORTER_TIER_ID = '9413287'
const FF_SUPPORTER_TIER_ID = '9413329'
const ONE_ARMY_SUPPORTER_TIER_ID = '3929404'
const ONE_ARMY_PLUS_SUPPORTER_TIER_ID = '1359808'
const ONE_ARMY_MAGIC_SUPPORTER_TIER_ID = '6369370'

const isValidTierId = (id: string) => {
  const oneArmyTierIds = [
    ONE_ARMY_SUPPORTER_TIER_ID,
    ONE_ARMY_PLUS_SUPPORTER_TIER_ID,
    ONE_ARMY_MAGIC_SUPPORTER_TIER_ID,
  ]
  if (oneArmyTierIds.includes(id)) return true
  switch (CONFIG.deployment.site_url) {
    case 'https://dev.onearmy.world':
    case 'https://community.preciousplastic.com':
      return id === PP_SUPPORTER_TIER_ID
    case 'https://dev.community.projectkamp.com':
    case 'https://community.projectkamp.com':
      return id === PK_SUPPORTER_TIER_ID
    case 'https://dev.community.fixing.fashion':
    case 'https://community.fixing.fashion':
      return id === FF_SUPPORTER_TIER_ID
    default:
      // Return true for local development.
      return true
  }
}

export const isSupporter = (patreonUser: PatreonUser) => {
  const supportsValidTier = patreonUser.membership?.tiers
    .map(({ id }) => id)
    .some(isValidTierId)
  return (
    patreonUser.membership?.attributes.patron_status === 'active_patron' &&
    supportsValidTier
  )
}

const parsePatreonUser = (patreonUser: any): PatreonUser => {
  // As we do not request the identity.membership scope, we only receive the user's membership to the
  // One Army Patreon page, not other campaigns they may be part of.
  const membership =
    patreonUser.data.relationships.memberships.data.length > 0
      ? patreonUser.included.find(({ type }) => type === 'member')
      : undefined

  const tiers = membership?.relationships.currently_entitled_tiers.data
    .map(({ id }) =>
      patreonUser.included.find(
        ({ type, id: includedId }) => type === 'tier' && id === includedId,
      ),
    )
    .map(({ id, attributes }) => ({ id, attributes }))

  const userMembership = membership
    ? {
        id: membership.id,
        attributes: membership.attributes,
        tiers,
      }
    : undefined

  return {
    id: patreonUser.data.id,
    attributes: patreonUser.data.attributes,
    link: patreonUser.links.self,
    // Only include membership if the user is a member of the One Army Patreon page.
    ...(userMembership ? { membership: userMembership } : {}),
  }
}

/*
 * docs: https://docs.patreon.com/#get-api-oauth2-v2-identity
 * to fetch more user attributes, add them to the include and fields query params
 **/
const getCurrentPatreonUser = (accessToken: string) => {
  const userFields: Array<keyof PatreonUserAttributes> = [
    'about',
    'created',
    'email',
    'first_name',
    'full_name',
    'image_url',
    'last_name',
    'thumb_url',
    'url',
  ]

  const membershipFields: Array<keyof PatreonMembershipAttributes> = [
    'campaign_lifetime_support_cents',
    'currently_entitled_amount_cents',
    'is_follower',
    'last_charge_date',
    'last_charge_status',
    'lifetime_support_cents',
    'next_charge_date',
    'note',
    'patron_status',
    'pledge_cadence',
    'pledge_relationship_start',
    'will_pay_amount_cents',
  ]

  const tierFields: Array<keyof PatreonTierAttributes> = [
    'amount_cents',
    'created_at',
    'description',
    'edited_at',
    'image_url',
    'patron_count',
    'published',
    'published_at',
    'title',
    'url',
  ]

  const url = encodeURI(
    `https://www.patreon.com/api/oauth2/v2/identity?include=memberships,memberships.currently_entitled_tiers&fields[user]=${userFields.join(
      ',',
    )}&fields[member]=${membershipFields.join(
      ',',
    )}&fields[tier]=${tierFields.join(',')}`,
  )

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => res.json())
    .then((response) => {
      if (response.errors) {
        throw Error(response.errors[0].detail)
      }
      return response
    })
    .catch((err) => {
      console.log('Error fetching patreon user', err)
      throw new functions.https.HttpsError(
        'internal',
        'Patreon authentication failed.',
      )
    })
}

export const patreonAuth = functions
  .runWith({ memory: MEMORY_LIMIT_512_MB })
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called while authenticated.',
      )
    }
    //   Validate user exists before triggering function.
    const { uid: authId } = context.auth
    const userSnapshot = await db
      .collection(DB_ENDPOINTS.users)
      .where('_authID', '==', authId)
      .get()
    const user = userSnapshot.docs[0]?.data() as IUserDB
    if (!user) {
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
        const patreonUserParsed = parsePatreonUser(patreonUser)
        const isSupporterUser = isSupporter(patreonUserParsed)
        try {
          await db
            .collection(DB_ENDPOINTS.users)
            .doc(user._id)
            .update({
              patreon: patreonUserParsed,
              badges: {
                supporter: isSupporterUser,
              },
            })

          await db
            .collection(DB_ENDPOINTS.user_integrations)
            .doc(user._id)
            .set(
              {
                authId,
                patreon: {
                  accessToken: access_token,
                  refreshToken: refresh_token,
                  expiresAt: expires_in,
                },
              },
              {
                merge: true,
              },
            )
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
