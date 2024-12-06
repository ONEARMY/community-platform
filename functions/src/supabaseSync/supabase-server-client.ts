import { createServerClient } from '@supabase/ssr'

export function createSupabaseServerClient() {
  const supabase = {
    headers: new Headers(),
    client: createServerClient(
      process.env.SUPABASE_API_URL,
      process.env.SUPABASE_API_KEY,
      {
        cookies: {
          getAll() {
            return []
          },
        },
        global: {
          headers: {
            'x-tenant-id': process.env.TENANT_ID,
          },
        },
      },
    ),
  }

  return supabase
}
