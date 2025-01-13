/* eslint-disable unicorn/filename-case */
import { Form, redirect, useActionData } from '@remix-run/react'
import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { ActionFunctionArgs } from '@remix-run/node'

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)
  const formData = await request.formData()
  const { error } = await client.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) {
    return Response.json({ success: false }, { headers })
  }

  // TODO: returnUrl
  return redirect('/')
}

export default function Login() {
  const actionResponse = useActionData<typeof action>()

  return (
    <>
      {!actionResponse?.success ? (
        <Form method="post">
          <input type="email" name="email" placeholder="Your Email" required />
          <input
            type="password"
            name="password"
            placeholder="Your Password"
            required
          />
          <br />
          <button type="submit">Sign In</button>
        </Form>
      ) : (
        <h3>Invalid credentials.</h3>
      )}
    </>
  )
}
