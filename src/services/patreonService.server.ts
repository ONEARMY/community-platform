import { DB_ENDPOINTS } from 'oa-shared'
import { firestore } from 'src/utils/firebase'

import type { SupabaseClient, User } from '@supabase/supabase-js'
import type {
  PatreonMembershipAttributes,
  PatreonSettings,
  PatreonTierAttributes,
  PatreonUser,
  PatreonUserAttributes,
} from 'oa-shared'

const isSupporter = async (
  patreonUser: PatreonUser,
  client: SupabaseClient,
) => {
  if (patreonUser.membership?.attributes.patron_status !== 'active_patron') {
    return false
  }

  const result = await client.from('patreon_settings').select('tiers').limit(1)
  const patreonSettings = result.data?.[0] as PatreonSettings

  const validIds = patreonSettings.tiers.map((x) => x.id)

  return patreonUser.membership?.tiers.some(({ id }) => validIds.includes(id))
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
const getCurrentPatreonUser = async (accessToken: string) => {
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

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const { error } = await response.json()
    console.error(error)
    throw new Error('Error getting patreon user')
  }

  return await response.json()
}

const verifyAndUpdatePatreonUser = async (
  code: string,
  user: User,
  client: SupabaseClient,
  origin: string,
) => {
  const PATREON_CLIENT_ID = process.env.PATREON_CLIENT_ID
  const PATREON_CLIENT_SECRET = process.env.PATREON_CLIENT_SECRET

  if (!PATREON_CLIENT_ID || !PATREON_CLIENT_SECRET) {
    throw new Error('PATREON_CLIENT_ID and PATREON_CLIENT_SECRET must be set')
  }

  const response = await fetch(
    `https://www.patreon.com/api/oauth2/token?code=${code}&grant_type=authorization_code&client_id=${PATREON_CLIENT_ID}&client_secret=${PATREON_CLIENT_SECRET}&redirect_uri=${origin}/patreon`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )

  if (!response.ok) {
    const { error } = await response.json()
    console.error(error)
    throw new Error('Error getting patreon access token')
  }

  const { access_token } = await response.json()
  const patreonUser = await getCurrentPatreonUser(access_token)
  const patreonUserParsed = parsePatreonUser(patreonUser)
  const isSupporterUser = await isSupporter(patreonUserParsed, client)

  // Update in supabase
  await client
    .from('profiles')
    .update({
      patreon: patreonUserParsed,
      is_supporter: isSupporterUser,
    })
    .eq('auth_id', user.id)

  // Update in firebase - need this until we fully migrate profile and map
  await firestore
    .doc(DB_ENDPOINTS.users + '/' + user.user_metadata['username'])
    .update({
      patreon: patreonUserParsed,
      badges: {
        supporter: isSupporterUser,
      },
    })
}

const disconnectUser = async (user: User, client: SupabaseClient) => {
  await client
    .from('profiles')
    .update({ patreon: null, is_supporter: false })
    .eq('auth_id', user.id)

  // Update in firebase - need this until we fully migrate profile and map
  await firestore
    .doc(DB_ENDPOINTS.users + '/' + user.user_metadata['username'])
    .update({
      patreon: null,
      badges: {
        supporter: false,
      },
    })
}

export const patreonServiceServer = {
  verifyAndUpdatePatreonUser,
  disconnectUser,
}
