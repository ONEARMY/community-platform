import { MOCK_DATA } from '../data'
import { seedDatabase, supabaseAdminClient } from '../utils/TestUtils'

import type { SupabaseClient, User } from '@supabase/supabase-js'
import type {
  DBProfile,
  DBProfileBadge,
  DBProfileTag,
  DBProfileType,
  Profile,
} from 'oa-shared'

// Creates user accounts and respective profiles
export const seedAccounts = async (
  profileBadges: DBProfileBadge[],
  profileTags: DBProfileTag[],
  profileTypes: DBProfileType[],
) => {
  const supabase = supabaseAdminClient()

  const accounts = Object.values(MOCK_DATA.users).map((user) => ({
    email: user['email'],
    password: user['password'],
    ...user,
  }))

  const existingUsers = await supabase.auth.admin.listUsers({ perPage: 10000 })

  const profiles = await Promise.all(
    accounts.map(async (account) => {
      const profileType =
        profileTypes.find((type) => type.name === account.profileType) ||
        profileTypes[0]

      return await createAuthAndProfile(
        supabase,
        account,
        existingUsers.data.users,
        profileBadges[0].id,
        [profileTags[0].id, profileTags[1].id],
        profileType.id,
      )
    }),
  )

  return { profiles }
}

const createAuthAndProfile = async (
  supabase,
  user,
  existingUsers: User[],
  profileBadgeId: number,
  profilTagIds: number[],
  profileTypeId: number,
) => {
  const authUser = await supabase.auth.admin.createUser({
    email: user.email,
    password: user.password,
    email_confirm: true,
    user_metadata: {
      username: user.username,
    },
  })

  let profile
  if (authUser.error?.code === 'email_exists') {
    const authUser = existingUsers.find(
      (authUser) => authUser.email === user.email,
    )

    if (authUser) {
      return (profile = await createProfile(
        supabase,
        user,
        authUser.id,
        profileBadgeId,
        profilTagIds,
        profileTypeId,
      ))
    }

    return profile
  }

  const authId = authUser.data.id
  return await createProfile(
    supabase,
    user,
    authId,
    profileBadgeId,
    profilTagIds,
    profileTypeId,
  )
}

const createProfile = async (
  supabase: SupabaseClient,
  user: Partial<Profile>,
  authId: string,
  profileBadgeId: number,
  profilTagIds: number[],
  profileTypeId: number,
) => {
  const tenantId = Cypress.env('TENANT_ID')

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_id', authId)
    .eq('tenant_id', tenantId)
    .single()

  if (data) {
    return data
  }

  const profileDB: Partial<DBProfile> & { tenant_id: string } = {
    created_at: user.createdAt,
    auth_id: authId,
    display_name: user.displayName,
    username: user.username,
    roles: user.roles,
    tenant_id: tenantId,
    profile_type: profileTypeId,
    about: user.about || '',
    photo: user.photo || null,
    country: user.country,
    cover_images: user.coverImages || ([] as any),
    impact: user.impact || null,
    is_blocked_from_messaging: user.isBlockedFromMessaging || false,
    is_contactable: user.isContactable || true,
    last_active: user.lastActive || null,
    website: user.website || null,
  }

  const profileResult = await supabase
    .from('profiles')
    .insert(profileDB)
    .select('*')
    .single()

  if (profileResult.data.username === 'demo_user') {
    await seedDatabase(
      {
        profile_badges_relations: [
          {
            profile_id: profileResult.data.id,
            profile_badge_id: profileBadgeId,
            tenant_id: tenantId,
          },
        ],
      },
      tenantId,
    )
  }
  console.log({ profilTagIds })
  Promise.all(
    profilTagIds.map(async (profileTag) => {
      return seedDatabase(
        {
          profile_tags_relations: [
            {
              profile_id: profileResult.data.id,
              profile_tag_id: profileTag,
              tenant_id: tenantId,
            },
          ],
        },
        tenantId,
      )
    }),
  )

  return profileResult.data
}

export const deleteAccounts = async () => {
  const adminClient = supabaseAdminClient()
  const mockUsers = new Set(
    Object.values(MOCK_DATA.users)
      .filter((x) => !!x['email'])
      .map((x) => x['email']),
  )
  const result = await adminClient.auth.admin.listUsers()

  for (const user of result.data.users) {
    // only delete mock users and test users
    if (mockUsers.has(user.email) || user.email!.endsWith('@resend.dev')) {
      await adminClient.auth.admin.deleteUser(user.id)
    }
  }
}
