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

export const clearDatabase = (tables: string[], _tenantId: string) => {
  // Use Cypress tasks for server-side operations
  // sequential so there are no constraint issues
  tables.forEach((table) => {
    cy.task('supabase:query', {
      table,
      method: 'delete',
      filter: { tenant_id: _tenantId },
    })
  })
}

export const createStorage = async (tenantId: string) => {
  await new Cypress.Promise(async (resolve) => {
    cy.task('supabase:storage:createBucket', {
      bucketName: tenantId,
      options: { public: true },
    }).then(() => {
      cy.task('supabase:storage:createBucket', {
        bucketName: tenantId + '-documents',
      }).then(() => resolve())
    })
  })
}

export const clearStorage = async (tenantId: string) => {
  await new Cypress.Promise((resolve) => {
    cy.task('supabase:storage:emptyBucket', {
      bucketName: tenantId,
    }).then(() => {
      cy.task('supabase:storage:deleteBucket', {
        bucketName: tenantId,
      }).then(() => {
        cy.task('supabase:storage:emptyBucket', {
          bucketName: tenantId + '-documents',
        }).then(() => {
          cy.task('supabase:storage:deleteBucket', {
            bucketName: tenantId + '-documents',
          }).then(() => resolve())
        })
      })
    })
  })
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
    email: `delivered+${username}@resend.dev`.toLocaleLowerCase(),
    password: 'test1234',
  }
}

export const getUserProfileByUsername = async (
  username: string,
  _tenantId: string,
) => {
  return new Cypress.Promise((resolve) => {
    cy.task('supabase:query', {
      table: 'profiles',
      method: 'select',
      data: '*',
      filter: { username },
    }).then((data: any) => {
      resolve(data && Array.isArray(data) && data.length > 0 ? data[0] : null)
    })
  })
}

export const setIsPreciousPlastic = () => {
  return localStorage.setItem('platformTheme', 'precious-plastic')
}

export const seedDatabase = async (
  data: SeedData,
  _tenantId: string,
): Promise<any> => {
  const results = {}

  for (const [table, rows] of Object.entries(data)) {
    try {
      const result = await new Cypress.Promise((resolve) => {
        cy.task('supabase:query', {
          table,
          method: 'insert',
          data: rows,
        }).then((data) => resolve(data))
      })
      results[table] = { data: result, error: null }
    } catch (error) {
      // If insert fails, try to select existing data
      const existingData = await new Cypress.Promise((resolve) => {
        cy.task('supabase:query', {
          table,
          method: 'select',
        }).then((data) => resolve(data))
      })
      results[table] = { data: existingData, error }
    }
  }

  return results
}

export const supabaseAdminClient = () =>
  createClient(
    Cypress.env('SUPABASE_API_URL'),
    Cypress.env('SUPABASE_SERVICE_ROLE_KEY'),
    {
      global: {
        headers: {
          'x-tenant-id': Cypress.env('TENANT_ID'),
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )

export const supabaseClient = (tenantId: string) =>
  createClient(Cypress.env('SUPABASE_API_URL'), Cypress.env('SUPABASE_KEY'), {
    global: {
      headers: {
        'x-tenant-id': tenantId,
      },
    },
  })
