import { useState } from 'react'
import { Banner, Icon } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { getProjectEmail } from 'src/utils/helpers'
import { Flex, Text } from 'theme-ui'

type VerificationEmailState = 'pending' | 'error' | 'sent'

/**
 * A simple notification banner component that allows users to (re-)send a verification email.
 */
export const AlertProfileVerification = () => {
  const [verificationState, setVerificationState] =
    useState<VerificationEmailState>('pending')
  const { userStore } = useCommonStores().stores
  const authUser = userStore.authUser

  if (!authUser || authUser.emailVerified) return null

  const isVerificationSuccessful = verificationState === 'sent'
  const isVerificationPending = verificationState === 'pending'
  const alertLabel = isVerificationPending
    ? 'Click here to receive an email to confirm your account'
    : "Sorry, we couldn't send an email. Please try again later."
  const successLabelMessage =
    'Verification email sent. Please check your inbox and spam folder. '
  const successLabelLinkText = "Let us know if you didn't get it."

  const onClick = async () => {
    if (isVerificationSuccessful) {
      window.location.href = getProjectEmail('Email%20confirmation%20failed')
    }

    if (!isVerificationSuccessful) {
      try {
        await userStore.sendEmailVerification()
        setVerificationState('sent')
      } catch (error) {
        setVerificationState('error')
      }
    }
  }

  return (
    <Flex data-cy="emailNotVerifiedBanner">
      <Banner
        onClick={onClick}
        variant={isVerificationSuccessful ? 'success' : 'failure'}
      >
        {isVerificationSuccessful && (
          <Text>
            {successLabelMessage}
            <strong>{successLabelLinkText}</strong>
          </Text>
        )}

        {!isVerificationSuccessful && (
          <>
            {isVerificationPending && (
              <Icon glyph="email" mr={1} verticalAlign={'text-top'} />
            )}
            <Text>{alertLabel}</Text>
          </>
        )}
      </Banner>
    </Flex>
  )
}
