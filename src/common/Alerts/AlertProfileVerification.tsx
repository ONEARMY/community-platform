import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { ExternalLink, Icon } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { getProjectEmail } from 'src/utils/helpers'
import { Alert, Flex, Text } from 'theme-ui'

type VerificationEmailState = 'pending' | 'error' | 'sent'

/**
 * A simple notification banner component that allows users to (re-)send a verification email.
 */
export const AlertProfileVerification = observer(() => {
  const [verificationState, setVerificationState] =
    useState<VerificationEmailState>('pending')
  const { userStore } = useCommonStores().stores
  const authUser = userStore.authUser
  if (!authUser) return null

  if (authUser.emailVerified) return null

  const handleOnClick = async () => {
    try {
      await userStore.sendEmailVerification()
      setVerificationState('sent')
    } catch (error) {
      setVerificationState('error')
    }
  }

  const isVerificationSuccessful = verificationState === 'sent'
  const isVerificationPending = verificationState === 'pending'
  const alertLabel = isVerificationPending
    ? 'Click here to receive an email to confirm your account.'
    : "Sorry, we couldn't send an email. Please try again later."
  const successLabelMessage =
    'Verification email sent. Please check your inbox and spam folder. '
  const successLabelLinkText = "Let us know if you didn't get it."

  return (
    <Flex data-cy="emailNotVerifiedBanner">
      <Alert
        onClick={handleOnClick}
        variant={isVerificationSuccessful ? 'success' : 'failure'}
        sx={{
          borderRadius: 0,
          alignItems: 'center',
          flex: '1',
          justifyContent: 'center',
        }}
      >
        {isVerificationSuccessful && (
          <Text
            sx={{
              textAlign: 'center',
              fontSize: 2,
              fontWeight: 'normal',
            }}
          >
            {successLabelMessage}
            <ExternalLink
              sx={{ textDecoration: 'underline', color: 'grey' }}
              href={getProjectEmail('Email%20confirmation%20failed')}
            >
              {successLabelLinkText}
            </ExternalLink>
          </Text>
        )}
        {!isVerificationSuccessful && (
          <Text
            sx={{
              textAlign: 'center',
              fontSize: 2,
              fontWeight: 'normal',
              textDecoration: isVerificationPending ? 'underline' : 'none',
              cursor: isVerificationPending ? 'pointer' : 'default',
            }}
          >
            {isVerificationPending && (
              <Icon glyph="email" mr={1} verticalAlign={'text-top'} />
            )}
            {alertLabel}
          </Text>
        )}
      </Alert>
    </Flex>
  )
})
