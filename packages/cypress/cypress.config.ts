// cypress.config.ts
import { createClient } from '@supabase/supabase-js'
import { defineConfig } from 'cypress'

export default defineConfig({
  defaultCommandTimeout: 15000,
  watchForFileChanges: true,
  chromeWebSecurity: false,
  video: true,
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'coverage/out-[hash].xml',
  },
  downloadsFolder: 'src/downloads',
  fixturesFolder: 'src/fixtures',
  screenshotsFolder: 'src/screenshots',
  videosFolder: 'src/videos',
  projectId: '4s5zgo',
  viewportWidth: 1000,
  viewportHeight: 1000,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    setupNodeEvents: (on, config) => {
      // Initialize Supabase client with secret key for server-side operations
      const supabase = createClient(
        config.env.SUPABASE_URL || process.env.SUPABASE_URL,
        config.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SECRET_KEY,
      )

      on('task', {
        log(message) {
          console.log(message)
          return null
        },

        // Admin API operations
        async 'supabase:admin:listUsers'(
          params: { page?: string; perPage?: number } = {},
        ) {
          try {
            const { data, error } = await supabase.auth.admin.listUsers({
              page: params.page ? parseInt(params.page) : undefined,
              perPage: params.perPage || 10000,
            })
            if (error) throw error
            return data
          } catch (error) {
            console.error('Failed to list users:', error)
            throw error
          }
        },

        async 'supabase:admin:createUser'(params: {
          email: string
          password: string
          email_confirm?: boolean
          user_metadata?: any
        }) {
          try {
            const { data, error } = await supabase.auth.admin.createUser({
              email: params.email,
              password: params.password,
              email_confirm: params.email_confirm ?? true,
              user_metadata: params.user_metadata,
            })
            if (error) throw error
            return data
          } catch (error) {
            console.error('Failed to create user:', error)
            throw error
          }
        },

        async 'supabase:admin:deleteUser'(userId: string) {
          try {
            const { data, error } = await supabase.auth.admin.deleteUser(userId)
            if (error) throw error
            return data
          } catch (error) {
            console.error('Failed to delete user:', error)
            throw error
          }
        },

        // Database operations
        async 'supabase:query'(params: {
          table: string
          method: 'select' | 'insert' | 'update' | 'delete' | 'upsert'
          data?: any
          filter?: any
        }) {
          try {
            let query: any = supabase.from(params.table)

            switch (params.method) {
              case 'select':
                query = query.select(params.data || '*')
                break
              case 'insert':
                query = query.insert(params.data)
                break
              case 'update':
                query = query.update(params.data)
                break
              case 'delete':
                query = query.delete()
                break
              case 'upsert':
                query = query.upsert(params.data)
                break
            }

            // Apply filters if provided
            if (params.filter) {
              Object.entries(params.filter).forEach(([key, value]) => {
                query = query.eq(key, value)
              })
            }

            const { data, error } = await query
            if (error) throw error
            return data
          } catch (error) {
            console.error('Supabase query failed:', error)
            throw error
          }
        },

        // Storage operations
        async 'supabase:storage:createBucket'(params: {
          bucketName: string
          options?: any
        }) {
          try {
            const { data, error } = await supabase.storage.createBucket(
              params.bucketName,
              params.options,
            )
            if (error) throw error
            return data
          } catch (error) {
            console.error('Failed to create bucket:', error)
            throw error
          }
        },

        async 'supabase:storage:uploadFile'(params: {
          bucketName: string
          path: string
          file: Buffer | Blob
          options?: any
        }) {
          try {
            const { data, error } = await supabase.storage
              .from(params.bucketName)
              .upload(params.path, params.file, params.options)
            if (error) throw error
            return data
          } catch (error) {
            console.error('Failed to upload file:', error)
            throw error
          }
        },

        async 'supabase:storage:deleteFiles'(params: {
          bucketName: string
          paths: string[]
        }) {
          try {
            const { data, error } = await supabase.storage
              .from(params.bucketName)
              .remove(params.paths)
            if (error) throw error
            return data
          } catch (error) {
            console.error('Failed to delete files:', error)
            throw error
          }
        },

        async 'supabase:storage:emptyBucket'(params: { bucketName: string }) {
          try {
            const { data, error } = await supabase.storage.emptyBucket(
              params.bucketName,
            )
            if (error) throw error
            return data
          } catch (error) {
            console.error('Failed to empty bucket:', error)
            throw error
          }
        },

        async 'supabase:storage:deleteBucket'(params: { bucketName: string }) {
          try {
            const { data, error } = await supabase.storage.deleteBucket(
              params.bucketName,
            )
            if (error) throw error
            return data
          } catch (error) {
            console.error('Failed to delete bucket:', error)
            throw error
          }
        },
      })

      return config
    },
    baseUrl: 'http://localhost:3456',
    specPattern: 'src/integration/**/*.{js,jsx,ts,tsx}',
    supportFile: 'src/support/index.ts',
    experimentalStudio: true,
  },
})
