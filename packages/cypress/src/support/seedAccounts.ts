import { MOCK_DATA } from '../data'
import {
  seedDatabase,
  supabaseAdminClient,
  supabaseClient,
} from '../utils/TestUtils'

import type { SupabaseClient, User } from '@supabase/supabase-js'
import type {
  DBProfile,
  DBProfileBadge,
  DBProfileTag,
  DBProfileType,
  Profile,
} from 'oa-shared'

export const seedProfileImages = async (): Promise<
  { id: string; path: string; fullPath: string }[]
> => {
  const tenantId = Cypress.env('TENANT_ID')

  const supabase = supabaseClient(tenantId)
  const { data: image1Data } = await supabase.storage
    .from(tenantId)
    .upload('profiles/image1.png', new Blob())
  const { data: image2Data } = await supabase.storage
    .from(tenantId)
    .upload('profiles/image2.png', new Blob())

  return [image1Data, image2Data]
}

// Creates user accounts and respective profiles
export const seedAccounts = async (
  profileBadges: DBProfileBadge[],
  profileTags: DBProfileTag[],
  profileTypes: DBProfileType[],
  profileImages: { id: string; path: string; fullPath: string }[],
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
        profileImages,
      )
    }),
  )

  return { profiles }
}

const createAuthAndProfile = async (
  supabase: SupabaseClient,
  user: any,
  existingUsers: User[],
  profileBadgeId: number,
  profilTagIds: number[],
  profileTypeId: number,
  profileImages: { id: string; path: string; fullPath: string }[],
) => {
  const authUser = await supabase.auth.admin.createUser({
    email: user.email,
    password: user.password,
    email_confirm: true,
    user_metadata: {
      username: user.username,
    },
  })

  let authId: string

  if (authUser.error?.code === 'email_exists') {
    const existingUser = existingUsers.find(
      (existingUser) => existingUser.email === user.email,
    )

    authId = existingUser.id
  } else if (authUser.data?.user?.id) {
    authId = authUser.data.user.id
  }

  return await createProfile(
    supabase,
    user,
    authId,
    profileBadgeId,
    profilTagIds,
    profileTypeId,
    profileImages,
  )
}

const createProfile = async (
  supabase: SupabaseClient,
  user: Partial<Profile>,
  authId: string,
  profileBadgeId: number,
  profilTagIds: number[],
  profileTypeId: number,
  profileImages: { id: string; path: string; fullPath: string }[],
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
    photo: user.photo ? profileImages[0] : null,
    country: user.country,
    cover_images: user.coverImages || ([] as any),
    impact: JSON.stringify(user.impact) || null,
    is_blocked_from_messaging: user.isBlockedFromMessaging || false,
    is_contactable: user.isContactable || true,
    last_active: user.lastActive || null,
    website: user.website || null,
  }

  const profileResult = await supabase
    .from('profiles')
    .insert(profileDB)
    .select('*')

  if (!profileResult.data || profileResult.data.length === 0) {
    console.error('Failed to create profile')
  }

  if (profileResult.data[0].username === 'demo_user') {
    await seedDatabase(
      {
        profile_badges_relations: [
          {
            profile_id: profileResult.data[0].id,
            profile_badge_id: profileBadgeId,
            tenant_id: tenantId,
          },
        ],
      },
      tenantId,
    )
  }

  Promise.all(
    profilTagIds.map(async (profileTag) => {
      return seedDatabase(
        {
          profile_tags_relations: [
            {
              profile_id: profileResult.data[0].id,
              profile_tag_id: profileTag,
              tenant_id: tenantId,
            },
          ],
        },
        tenantId,
      )
    }),
  )

  return profileResult.data[0]
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
