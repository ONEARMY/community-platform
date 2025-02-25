import { createClient } from '@supabase/supabase-js'

type SeedData = {
  [tableName: string]: Array<Record<string, any>>
}

export interface IUserSignUpDetails {
  username: string
  email: string
  password: string
}

export enum Page {
  HOWTO = '/library',
  ACADEMY = '/academy',
  SETTINGS = '/settings',
}

export const generateAlphaNumeric = (length: number) => {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export enum DbCollectionName {
  users = 'users',
  howtos = 'howtos',
}

export const generateNewUserDetails = (): IUserSignUpDetails => {
  const username = `CI_${generateAlphaNumeric(9)}`.toLocaleLowerCase()
  return {
    username,
    email: `${username}@test.com`.toLocaleLowerCase(),
    password: 'test1234',
  }
}

export const setIsPreciousPlastic = () => {
  return localStorage.setItem('platformTheme', 'precious-plastic')
}

export const clearDatabase = async (tables: string[], tenantId: string) => {
  const supabase = supabaseClient(tenantId)

  // sequential so there are no constraint issues
  for (const table of tables) {
    await supabase.from(table).delete().eq('tenant_id', tenantId)
  }
}

export const getUserProfileByUsername = async (
  username: string,
  tenantId: string,
) => {
  const supabase = supabaseClient(tenantId)
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('username', username)
    .single()

  if (error || !data) {
    return error
  }

  return data
}

export const supabaseClient = (tenantId: string) =>
  createClient(Cypress.env('SUPABASE_API_URL'), Cypress.env('SUPABASE_KEY'), {
    global: {
      headers: {
        'x-tenant-id': tenantId,
      },
    },
  })

export const seedDatabase = async (
  data: SeedData,
  tenantId: string,
): Promise<any> => {
  const supabase = supabaseClient(tenantId)
  const results = {}

  for (const [table, rows] of Object.entries(data)) {
    const result = await supabase.from(table).insert(rows).select()

    if (!result.error) {
      results[table] = result
      continue
    }

    results[table] = await supabase.from(table).select()
  }

  return results
}

export const supabaseAdminClient = () =>
  createClient(
    Cypress.env('SUPABASE_API_URL'),
    Cypress.env('SUPABASE_SERVICE_ROLE_KEY'),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
