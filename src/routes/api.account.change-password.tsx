import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { ActionFunctionArgs } from '@remix-run/node'

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)
  const formData = await request.formData()

  const oldPassword = formData.get('oldPassword') as string
  const newPassword = formData.get('newPassword') as string

  const {
    data: { user },
  } = await client.auth.getUser()

  const signInResult = await client.auth.signInWithPassword({
    email: user!.email as string,
    password: oldPassword,
  })

  if (signInResult.error) {
    return Response.json(
      { error: 'Invalid password' },
      { headers, status: 400 },
    )
  }

  const result = await client.auth.updateUser({ password: newPassword })

  if (result.error) {
    return Response.json(
      {
        error: result.error.message,
      },
      { headers, status: 400 },
    )
  }

  return new Response(null, { headers, status: 204 })
}
