import { createClient } from '@supabase/supabase-js'

export function createSupabaseAdminServerClient() {
  return createClient(
    process.env.SUPABASE_API_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          'x-tenant-id': process.env.TENANT_ID!,
        },
      },
    },
  )
}
