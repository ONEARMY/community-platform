import { useState } from 'react'
import { Field, Form } from 'react-final-form'
import { Link, useNavigate } from '@remix-run/react'
import { observer } from 'mobx-react'
import { Button, ExternalLink, FieldInput, HeroBanner } from 'oa-components'
import { FRIENDLY_MESSAGES } from 'oa-shared'
import { PasswordField } from 'src/common/Form/PasswordField'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { logger } from 'src/logger'
import { checkUserNameUnique } from 'src/utils/checkUserNameUnique'
import { formatLowerNoSpecial } from 'src/utils/helpers'
import {
  composeValidators,
  noSpecialCharacters,
  required,
} from 'src/utils/validators'
import { Card, Flex, Heading, Label, Text } from 'theme-ui'
import { bool, object, ref, string } from 'yup'

interface IFormValues {
  email: string
  password: string
  passwordConfirmation: string
  displayName: string
  consent: boolean
}
interface IState {
  formValues: IFormValues
  errorMsg?: string
  disabled?: boolean
}

const rowWidth = ['100%', '100%', `100%`]

const SignUpPage = observer(() => {
  const navigate = useNavigate()
  const { userStore } = useCommonStores().stores
  const [state, setState] = useState<IState>({
    formValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
      displayName: '',
      consent: false,
    },
  })

  const validationSchema = object({
    displayName: string()
      .min(2, 'Username must be at least 2 characters')
      .required('Required')
      .test(
        'is-unique',
        FRIENDLY_MESSAGES['sign-up/username-taken'],
        (value) => {
          return checkUserNameUnique(userStore, value)
        },
      ),
    email: string()
      .email(FRIENDLY_MESSAGES['auth/invalid-email'])
      .required('Required'),
    password: string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    'confirm-password': string()
      .oneOf([ref('password'), ''], 'Your new password does not match')
      .required('Password confirm is required'),
    consent: bool().oneOf([true], 'Consent is required'),
  })

  const onSignupSubmit = async (v: IFormValues) => {
    const { email, password, displayName } = v
    const userName = formatLowerNoSpecial(displayName as string)

    try {
      if (await checkUserNameUnique(userStore, userName)) {
        await userStore!.registerNewUser(email, password, displayName)
        navigate('/sign-up-message')
      } else {
        setState((prev) => ({
          ...prev,
          errorMsg: FRIENDLY_MESSAGES['sign-up/username-taken'],
          disabled: false,
        }))
      }
    } catch (error) {
      logger.error(`Error signing up`, { errorCode: error.code, displayName })
      setState((prev) => ({
        ...prev,
        errorMsg: FRIENDLY_MESSAGES[error.code] || error.message,
        disabled: false,
      }))
    }
  }

  return (
    <Form
      onSubmit={(v) => onSignupSubmit(v as IFormValues)}
      validate={async (values: any) => {
        try {
          await validationSchema.validate(values, { abortEarly: false })
        } catch (err) {
          return err.inner.reduce(
            (acc: any, error) => ({
              ...acc,
              [error.path]: error.message,
            }),
            {},
          )
        }
      }}
      render={({ submitting, invalid, handleSubmit }) => {
        const disabled = invalid || submitting
        return (
          <form onSubmit={handleSubmit}>
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
                    <Flex sx={{ flexDirection: 'column', gap: 2 }}>
                      <Heading>Create an account</Heading>
                      <Text color={'grey'} sx={{ fontSize: 1 }}>
                        <Link
                          to="/sign-in"
                          style={{
                            textDecoration: 'underline',
                          }}
                        >
                          {' '}
                          Already have an account? Sign-in here
                        </Link>
                      </Text>
                    </Flex>
                    {state.errorMsg && (
                      <Text color={'red'} data-cy="error-msg">
                        {state.errorMsg}
                      </Text>
                    )}
                    <Flex
                      sx={{
                        width: rowWidth,
                        flexDirection: 'column',
                      }}
                    >
                      <Label htmlFor="displayName">Username</Label>
                      <Text color={'grey'} sx={{ fontSize: 1 }}>
                        Think carefully. You can't change this.
                      </Text>
                      <Field
                        data-cy="username"
                        name="displayName"
                        type="userName"
                        component={FieldInput}
                        placeholder="youruniqueusername"
                        validate={composeValidators(
                          required,
                          noSpecialCharacters,
                        )}
                      />
                    </Flex>
                    <Flex
                      sx={{
                        flexDirection: 'column',
                        width: rowWidth,
                      }}
                    >
                      <Label htmlFor="email">Email</Label>
                      <Text color={'grey'} sx={{ fontSize: 1 }}>
                        It can be personal or work email.
                      </Text>
                      <Field
                        data-cy="email"
                        name="email"
                        type="email"
                        component={FieldInput}
                        placeholder="yourname@domain.com"
                        validate={required}
                      />
                    </Flex>
                    <Flex
                      sx={{
                        flexDirection: 'column',
                        width: rowWidth,
                      }}
                    >
                      <Label htmlFor="password">Password</Label>
                      <PasswordField
                        data-cy="password"
                        name="password"
                        component={FieldInput}
                        validate={required}
                      />
                    </Flex>
                    <Flex
                      sx={{
                        flexDirection: 'column',
                        width: rowWidth,
                      }}
                    >
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <PasswordField
                        data-cy="confirm-password"
                        name="confirm-password"
                        component={FieldInput}
                        validate={required}
                      />
                    </Flex>
                    <Flex>
                      <Label
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Field
                          data-cy="consent"
                          name="consent"
                          type="checkbox"
                          component="input"
                          validate={required}
                        />
                        <Text
                          sx={{
                            fontSize: 2,
                          }}
                        >
                          I agree to the{' '}
                          <ExternalLink href="/terms">
                            Terms of Service
                          </ExternalLink>
                          <span> and </span>
                          <ExternalLink href="/privacy">
                            Privacy Policy
                          </ExternalLink>
                        </Text>
                      </Label>
                    </Flex>

                    <Flex>
                      <Button
                        large
                        sx={{
                          borderRadius: 3,
                          width: '100%',
                          justifyContent: 'center',
                        }}
                        data-cy="submit"
                        variant="primary"
                        disabled={disabled}
                        type="submit"
                      >
                        Create account
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
  )
})

export default SignUpPage
