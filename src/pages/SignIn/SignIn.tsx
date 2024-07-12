import React, { useEffect, useState } from 'react'
import { Field, Form } from 'react-final-form'
import { Link, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react'
import {
  Button,
  CelebrationHero,
  FieldInput,
  TextNotification,
} from 'oa-components'
import { getFriendlyMessage } from 'oa-shared'
import { PasswordField } from 'src/common/Form/PasswordField'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { required } from 'src/utils/validators'
import { Box, Card, Flex, Heading, Label, Text } from 'theme-ui'

interface IFormValues {
  email: string
  password: string
}
interface IState {
  formValues: IFormValues
  errorMsg?: string
  disabled?: boolean
  authProvider?: IAuthProvider
  notificationProps?: {
    isVisible: boolean
    variant: 'failure' | 'success'
    text: string
  }
}
interface IProps {
  onChange?: (e: React.FormEvent<any>) => void
  preloadValues?: any
}

interface IAuthProvider {
  provider: string
  buttonLabel: string
  inputLabel: string
}

const AUTH_PROVIDERS: { [provider: string]: IAuthProvider } = {
  firebase: {
    provider: 'Firebase',
    buttonLabel: 'Email / Password',
    inputLabel: 'Email Address',
  },
}

const SignInPage = observer((props: IProps) => {
  const { userStore } = useCommonStores().stores
  const navigate = useNavigate()
  const [{ authProvider, notificationProps, errorMsg }, setState] =
    useState<IState>({
      // if passed form values from props initially populate
      formValues: {
        email: props.preloadValues ? props.preloadValues.email : '',
        password: props.preloadValues ? props.preloadValues.password : '',
      },
      authProvider: AUTH_PROVIDERS.firebase,
    })

  const onLoginSubmit = async (v: IFormValues) => {
    setState((state) => ({ ...state, disabled: true }))
    try {
      await userStore!.login(v.email, v.password)
      navigate(-1)
    } catch (error) {
      const friendlyErrorMessage = getFriendlyMessage(error.code)
      setState((state) => ({
        ...state,
        errorMsg: friendlyErrorMessage,
        disabled: false,
      }))
    }
  }

  const resetPasword = async (inputEmail: string) => {
    try {
      await userStore!.sendPasswordResetEmail(inputEmail)
      setState((state) => ({
        ...state,
        notificationProps: {
          isVisible: true,
          text: 'Reset email sent',
          variant: 'success',
        },
      }))
    } catch (error) {
      setState((state) => ({
        ...state,
        notificationProps: {
          isVisible: true,
          text: error.code,
          variant: 'failure',
        },
      }))
    }
  }

  useEffect(() => {
    if (userStore.authUser) {
      // User logged in
      navigate('/')
    }
  }, [userStore.authUser])

  return (
    <Form
      onSubmit={(v) => onLoginSubmit(v as IFormValues)}
      render={({ submitting, values, invalid, handleSubmit }) => {
        return (
          <>
            <form data-cy="login-form" onSubmit={handleSubmit}>
              <Flex
                bg="inherit"
                px={2}
                sx={{ width: '100%' }}
                css={{ maxWidth: '620px' }}
                mx={'auto'}
                mt={[5, 10]}
                mb={3}
              >
                <Flex sx={{ flexDirection: 'column', width: '100%' }}>
                  <CelebrationHero />
                  <Card bg={'softblue'}>
                    <Flex px={3} py={2}>
                      <Heading>Welcome back</Heading>
                    </Flex>
                  </Card>
                  <Card mt={3}>
                    <Flex
                      px={4}
                      pt={0}
                      pb={4}
                      sx={{
                        flexWrap: 'wrap',
                        flexDirection: 'column',
                        width: '100%',
                      }}
                    >
                      {/* PauthProvider Provider Select */}
                      {!authProvider && (
                        <>
                          <Text mb={3} mt={3}>
                            Login with :
                          </Text>
                          {Object.values(AUTH_PROVIDERS).map((p) => (
                            <Button
                              type="button"
                              sx={{ width: '100%' }}
                              key={p.provider}
                              mb={2}
                              variant="outline"
                              onClick={() =>
                                setState((state) => ({
                                  ...state,
                                  authProvider: p,
                                }))
                              }
                            >
                              {p.buttonLabel}
                            </Button>
                          ))}
                        </>
                      )}
                      {/* Login Form */}
                      {authProvider && (
                        <>
                          <Heading
                            variant="small"
                            py={4}
                            sx={{ width: '100%' }}
                          >
                            Log in to your account
                          </Heading>
                          <Flex sx={{ flexDirection: 'column' }} mb={3}>
                            <Label htmlFor="title">
                              {authProvider!.inputLabel}
                            </Label>
                            <Field
                              name="email"
                              type="email"
                              data-cy="email"
                              component={FieldInput}
                              validate={required}
                            />
                          </Flex>
                          <Flex sx={{ flexDirection: 'column' }} mb={3}>
                            <Label htmlFor="title">Password</Label>
                            <PasswordField
                              name="password"
                              data-cy="password"
                              component={FieldInput}
                              validate={required}
                            />
                          </Flex>
                          <Text color="red">{errorMsg}</Text>
                          <Flex mb={1} sx={{ justifyContent: 'space-between' }}>
                            <Text sx={{ fontSize: 1 }} color={'grey'} mt={2}>
                              <Link to={'/sign-up'} data-cy="no-account">
                                Don't have an account?
                              </Link>
                            </Text>
                            <Text sx={{ fontSize: 1 }} color={'grey'} mt={2}>
                              <Link
                                to="#"
                                data-cy="lost-password"
                                onClick={() => resetPasword(values.email)}
                              >
                                Lost password?
                              </Link>
                            </Text>
                          </Flex>

                          {notificationProps && (
                            <Box
                              sx={{
                                marginBottom: 3,
                              }}
                            >
                              <TextNotification
                                isVisible={notificationProps.isVisible}
                                variant={notificationProps.variant}
                              >
                                {getFriendlyMessage(notificationProps?.text)}
                              </TextNotification>
                            </Box>
                          )}

                          <Flex>
                            <Button
                              large
                              data-cy="submit"
                              sx={{ width: '100%', justifyContent: 'center' }}
                              variant={'primary'}
                              disabled={submitting || invalid}
                              type="submit"
                            >
                              Log in
                            </Button>
                          </Flex>
                        </>
                      )}
                    </Flex>
                  </Card>
                </Flex>
              </Flex>
            </form>
          </>
        )
      }}
    />
  )
})

export default SignInPage
