import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { ActionFunctionArgs } from '@remix-run/node'

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)
  const formData = await request.formData()

  const newEmail = formData.get('email') as string
  const password = formData.get('password') as string

  const {
    data: { user },
  } = await client.auth.getUser()

  const signInResult = await client.auth.signInWithPassword({
    email: user!.email as string,
    password,
  })

  if (signInResult.error) {
    return Response.json(
      { error: 'Invalid password' },
      { headers, status: 400 },
    )
  }

  const result = await client.auth.updateUser({ email: newEmail })

  if (result.error) {
    return Response.json(
      {
        error:
          result.error.code === 'email_exists'
            ? 'That email is already taken!'
            : 'Oops, something went wrong!',
      },
      { headers, status: 400 },
    )
  }

  return new Response(null, { headers, status: 204 })
}
