/* eslint-disable unicorn/filename-case */
import { redirect } from '@remix-run/react'
import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { ActionFunctionArgs } from '@remix-run/node'

export const loader = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)
  const { error } = await client.auth.signOut()

  if (error) {
    return Response.json({ success: false }, { headers })
  }

  const url = new URL(request.url)
  const returnUrl = url.searchParams.get('returnUrl')

  const location = returnUrl || '/'

  return redirect(location)
}
