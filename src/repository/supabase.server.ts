import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr'

// Create a single supabase client for interacting with your database
export function createSupabaseServerClient(request: Request) {
  const supabase = {
    headers: new Headers(),
    client: createServerClient(
      process.env.SUPABASE_API_URL!,
      process.env.SUPABASE_KEY!,
      {
        cookies: {
          getAll() {
            return parseCookieHeader(request.headers.get('Cookie') ?? '')
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              supabase.headers.append(
                'Set-Cookie',
                serializeCookieHeader(name, value, options),
              ),
            )
            supabase.headers.append('x-tenant-id', process.env.TENANT_ID!)
          },
        },
        global: {
          headers: {
            'x-tenant-id': process.env.TENANT_ID!,
          },
        },
      },
    ),
  }

  return supabase
}
