import { createClient } from '@supabase/supabase-js';

// Uses service_role key and bypasses RLS entirely.
// Only use for admin operations (e.g. auth.admin.createUser, auth.admin.updateUserById).
// For normal DB queries best to use createSupabaseServerClient(request) instead, so it respects RLS.
export function createSupabaseAdminServerClient() {
  return createClient(process.env.SUPABASE_API_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        'x-tenant-id': process.env.TENANT_ID!,
      },
    },
  });
}
