import * as React from 'react'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { PATREON_CLIENT_ID } from 'src/config/config'
import type { IUserPP } from 'src/models'
import { Flex, Image, Text } from 'theme-ui'
import { Button } from 'oa-components'

// TODO: rewrite this component to match specs https://github.com/ONEARMY/community-platform/pull/3016#issuecomment-1826722405
export const PatreonIntegrationBeta = ({ user }: { user: IUserPP }) => {
  const patreonRedirect = () => {
    // TODO: if user has patreon property already set, send request directly to backend, where we
    // can lookup the existing access code.

    // Otherwise, redirect to patreon to get access code.
    const redirectUri = `${window.location.protocol}//${window.location.host}/patreon`

    window.location.assign(
      `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${PATREON_CLIENT_ID}&redirect_uri=${redirectUri}`,
    )
  }

  return (
    <AuthWrapper roleRequired={'beta-tester'}>
      <Button
        large
        onClick={patreonRedirect}
        mb={3}
        sx={{ width: '100%', justifyContent: 'center' }}
        variant={'primary'}
      >
        {user.patreon ? 'Sync User Data' : 'Log in with Patreon'}
      </Button>
      {user.patreon && (
        <>
          <Flex
            style={{
              alignItems: 'center',
            }}
            mb="20px"
          >
            <Image
              src={user.patreon.attributes.thumb_url}
              width="40px"
              style={{ borderRadius: '50%', marginRight: '10px' }}
            />
            <Text>Successfully linked patron account! </Text>
          </Flex>
          {user.patreon.membership && (
            <Text>
              Thanks for being a{' '}
              <b>
                {user.patreon.membership.tiers
                  .map(({ attributes }) => attributes.title)
                  .join(', ')}
              </b>
              !
            </Text>
          )}
        </>
      )}
    </AuthWrapper>
  )
}
