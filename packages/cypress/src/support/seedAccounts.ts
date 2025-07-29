import { MOCK_DATA } from '../data'
import { supabaseAdminClient } from '../utils/TestUtils'

import type { SupabaseClient } from '@supabase/supabase-js'

// Creates user accounts and respective profiles
export const seedAccounts = async () => {
  const supabase = supabaseAdminClient()

  const accounts = Object.values(MOCK_DATA.users)
    .filter((x) => !!x['password'] && !!x['email'] && !!x.username)
    .map((user) => ({
      email: user['email'],
      password: user['password'],
      ...user,
    }))

  const existingUsers = await supabase.auth.admin.listUsers()

  let profiles
  if (existingUsers.data.users.length === 10) {
    const result = await Promise.all(
      existingUsers.data.users.map(async (authUser) => {
        const user = accounts.find(
          (account) => account.email === authUser.email,
        )
        return await createProfile(supabase, user, authUser.id)
      }),
    )
    profiles = result
  } else {
    const result = await Promise.all(
      accounts.map(
        async (account) => await createAuthAndProfile(supabase, account),
      ),
    )
    profiles = result
  }

  return { profiles }
}

const createAuthAndProfile = async (supabase, user) => {
  const authUser = await supabase.auth.admin.createUser({
    email: user.email,
    password: user.password,
    email_confirm: true,
    user_metadata: {
      username: user.username,
    },
  })

  const authId = authUser.data.id
  return await createProfile(supabase, user, authId)
}

const createProfile = async (
  supabase: SupabaseClient,
  user: any,
  authId: string,
) => {
  const tenantId = Cypress.env('TENANT_ID')

  const profileResult = await supabase
    .from('profiles')
    .upsert({
      auth_id: authId,
      display_name: user.username,
      username: user.username,
      roles: user.roles,
      tenant_id: tenantId,
      type: user.type,
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
