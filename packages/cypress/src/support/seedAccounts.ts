import { MOCK_DATA } from '../data'
import { supabaseAdminClient } from '../utils/TestUtils'

import type { SupabaseClient, User } from '@supabase/supabase-js'

// Creates user accounts and respective profiles
export const seedAccounts = async () => {
  const supabase = supabaseAdminClient()

  const accounts = Object.values(MOCK_DATA.users).map((user) => ({
    email: user['email'],
    password: user['password'],
    ...user,
  }))

  const existingUsers = await supabase.auth.admin.listUsers()

  const profiles = await Promise.all(
    accounts.map(
      async (account) =>
        await createAuthAndProfile(supabase, account, existingUsers.data.users),
    ),
  )

  return { profiles }
}

const createAuthAndProfile = async (supabase, user, existingUsers: User[]) => {
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
      return (profile = await createProfile(supabase, user, authUser.id))
    }

    return profile
  }

  const authId = authUser.data.id
  return await createProfile(supabase, user, authId)
}

const createProfile = async (
  supabase: SupabaseClient,
  user: any,
  authId: string,
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

  const profileResult = await supabase
    .from('profiles')
    .insert({
      auth_id: authId,
      display_name: user.username,
      username: user.username,
      roles: user.roles,
      tenant_id: tenantId,
      type: user.type,
      about: user.about || '',
      photo: user.photo || {},
    })
    .select('*')
    .single()

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
