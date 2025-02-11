import { Field, Form } from 'react-final-form'
import { redirect } from '@remix-run/node'
import { Link, useActionData } from '@remix-run/react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Button, FieldInput, HeroBanner, TextNotification } from 'oa-components'
import { PasswordField } from 'src/common/Form/PasswordField'
import Main from 'src/pages/common/Layout/Main'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server'
import { authServiceServer } from 'src/services/authService.server'
import { auth } from 'src/utils/firebase'
import { getReturnUrl } from 'src/utils/redirect.server'
import { generateTags, mergeMeta } from 'src/utils/seo.utils'
import { required } from 'src/utils/validators'
import { Card, Flex, Heading, Label, Text } from 'theme-ui'

import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client } = createSupabaseServerClient(request)
  const { data } = await client.auth.getUser()

  if (data.user) {
    return redirect(getReturnUrl(request))
  }

  return null
}

/**
 * 1. Try to sign in with supabase.
 * 2. If fail, try to sign in with firebase.
 * 3. If succeeds, confirm it's the first firebase login for this account by checking the auth_id profile value. (this prevents rolling back a password)
 * 4. If it's the first time, update the auth.user password and username (metadata), and it's profile auth_id.
 * 5. Sign in with supabase.
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)
  const formData = await request.formData()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await client.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // TODO: resend confirmation email flow

    console.error(error)

    try {
      const result = await signInWithEmailAndPassword(auth, email, password)

      const firebaseAuthId = result.user.uid

      if (!firebaseAuthId) {
        throw new Error()
      }

      const userAuthResult = await authServiceServer.getUserByFirebaseId(
        firebaseAuthId,
        client,
      )

      if (userAuthResult.error) {
        console.log(userAuthResult.error)
      }

      if (userAuthResult.data?.at(0)?.auth_id) {
        // If the user profile already has a auth_id value, it means the user already authenticated with supabase, thus the passwor is wrong.
        throw new Error()
      }

      const userIdResult = await client.rpc('get_user_id_by_email', {
        email: result.user.email,
      })
      const userAuthId = userIdResult.data[0]?.id

      if (!userAuthId) {
        // User doesn't exist. need to sign up.
        throw new Error()
      } else {
        const adminClient = createSupabaseAdminServerClient()
        const updatePassword = await adminClient.auth.admin.updateUserById(
          userAuthId,
          {
            password,
            user_metadata: {
              username: userAuthResult.data![0].username,
            },
          },
        )

        if (updatePassword.error) {
          console.error(error)
          throw new Error()
        }

        // Update profile to map with the supabase user
        await authServiceServer.updateUserProfile(
          { supabaseAuthId: userAuthId, firebaseAuthId },
          client,
        )

        // Sign in
        const signInResult = await client.auth.signInWithPassword({
          email,
          password,
        })

        if (signInResult.error) {
          console.error(error)
          throw new Error()
        }
      }
    } catch (error) {
      return Response.json(
        {
          error:
            "Invalid email or password. Or you haven't confirmed your account yet.",
        },
        { headers, status: 400 },
      )
    }
  }

  return redirect(getReturnUrl(request), { headers })
}

export const meta = mergeMeta<typeof loader>(() => {
  const title = `Login - ${import.meta.env.VITE_SITE_NAME}`

  return generateTags(title)
})

export default function Index() {
  const actionResponse = useActionData<typeof action>()

  return (
    <Main style={{ flex: 1 }}>
      <Form
        onSubmit={() => {}}
        render={({ submitting, invalid }) => {
          return (
            <form data-cy="login-form" method="post">
              <Flex
                sx={{
                  bg: 'inherit',
                  px: 2,
                  width: '100%',
                  maxWidth: '620px',
                  mx: 'auto',
                  mt: [5, 10],
                  mb: 3,
                }}
              >
                <Flex sx={{ flexDirection: 'column', width: '100%' }}>
                  <HeroBanner type="celebration" />
                  <Card sx={{ borderRadius: 3 }}>
                    <Flex
                      sx={{
                        flexWrap: 'wrap',
                        flexDirection: 'column',
                        padding: 4,
                        gap: 4,
                        width: '100%',
                      }}
                    >
                      <Flex sx={{ gap: 2, flexDirection: 'column' }}>
                        <Heading>Log in</Heading>
                        <Text sx={{ fontSize: 1 }} color="grey">
                          <Link to="/sign-up" data-cy="no-account">
                            Don't have an account? Sign-up here
                          </Link>
                        </Text>
                      </Flex>

                      {actionResponse?.error && (
                        <TextNotification isVisible={true} variant={'failure'}>
                          <Text>{actionResponse?.error}</Text>
                        </TextNotification>
                      )}

                      <Flex sx={{ flexDirection: 'column' }}>
                        <Label htmlFor="title">Email</Label>
                        <Field
                          name="email"
                          type="email"
                          data-cy="email"
                          component={FieldInput}
                          validate={required}
                        />
                      </Flex>
                      <Flex sx={{ flexDirection: 'column' }}>
                        <Label htmlFor="title">Password</Label>
                        <PasswordField
                          name="password"
                          data-cy="password"
                          component={FieldInput}
                          validate={required}
                        />
                      </Flex>
                      <Flex sx={{ justifyContent: 'space-between' }}>
                        <Text sx={{ fontSize: 1 }} color={'grey'}>
                          <Link to="/reset-password" data-cy="lost-password">
                            Forgotten password?
                          </Link>
                        </Text>
                      </Flex>

                      <Flex>
                        <Button
                          large
                          data-cy="submit"
                          sx={{
                            borderRadius: 3,
                            width: '100%',
                            justifyContent: 'center',
                          }}
                          variant="primary"
                          disabled={submitting || invalid}
                          type="submit"
                        >
                          Log in
                        </Button>
                      </Flex>
                    </Flex>
                  </Card>
                </Flex>
              </Flex>
            </form>
          )
        }}
      />
    </Main>
  )
}
