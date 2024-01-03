import * as React from 'react'
import { Button } from 'oa-components'
import { PATREON_CLIENT_ID } from 'src/config/config'
import { useCommonStores } from 'src/index'
import { Box, Flex, Heading, Image, Text } from 'theme-ui'

import { FlexSectionContainer } from './elements'

import type { IUserPP } from 'src/models'

const HEADING = '❤️ Become a Supporter'
const SUBHEADING =
  'Support us on Patreon to get a badge here on the platform and special insights and voting rights on decisions.'
const BETA_DISCLAIMER =
  'This feature is still in beta and we will continue to roll out more features for supporters.'
const SUCCESS_MESSAGE = 'Successfully linked Patreon account!'
const SUPPORTER_MESSAGE =
  'Thanks for supporting us! :) Update your data if you changed your Patreon tiers or remove the connection below.'

const CONNECT_BUTTON_TEXT = 'Connect To Patreon'
const UPDATE_BUTTON_TEXT = 'Update Patreon Data'
const REMOVE_BUTTON_TEXT = 'Remove Connection'

export const PatreonIntegration = () => {
  const { userStore } = useCommonStores().stores
  const [user, setUser] = React.useState<IUserPP | undefined>(
    userStore.user ?? undefined,
  )

  const removePatreonConnection = () => {
    if (!user) {
      return
    }
    userStore.removePatreonConnection(user.userName)
    // Perform an optimistic update to avoid waiting for database calls to return.
    setUser({
      ...user,
      badges: {
        ...user.badges,
        supporter: false,
      },
      patreon: undefined,
    })
  }

  const patreonRedirect = () => {
    // TODO: if user has patreon property already set, send request directly to backend, where we
    // can lookup the existing access code.

    // Otherwise, redirect to patreon to get access code.
    const redirectUri = `${window.location.protocol}//${window.location.host}/patreon`

    window.location.assign(
      `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${PATREON_CLIENT_ID}&redirect_uri=${redirectUri}`,
    )
  }

  if (!user) {
    return null
  }

  return (
    <FlexSectionContainer>
      <Heading variant="small">{HEADING}</Heading>
      <Text mt={4}>{SUBHEADING}</Text>
      <Text mt={4}>{BETA_DISCLAIMER}</Text>
      {user.patreon ? (
        <Box mt={4} mb={4}>
          <Flex
            style={{
              alignItems: 'center',
            }}
          >
            <Image
              src={user.patreon.attributes.thumb_url}
              sx={{
                borderRadius: '50%',
                marginRight: '10px',
                width: '40px',
                height: 'auto',
              }}
            />
            <Text>{SUCCESS_MESSAGE}</Text>
          </Flex>
          {user.patreon.membership && (
            <Flex sx={{ flexDirection: 'column' }}>
              <Text mt={4}>{SUPPORTER_MESSAGE}</Text>
              {user.patreon.membership.tiers.map(({ id, attributes }) => (
                <Flex
                  key={id}
                  style={{
                    alignItems: 'center',
                  }}
                  mt={4}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      overflow: 'hidden',
                      marginRight: '10px',
                    }}
                  >
                    <Image
                      src={attributes.image_url}
                      sx={{
                        borderRadius: '50%',
                        width: 'auto',
                        height: '40px',
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                    />
                  </div>
                  <Text>{attributes.title}</Text>
                </Flex>
              ))}
            </Flex>
          )}
        </Box>
      ) : (
        <Text mt={4} mb={4} sx={{ display: 'block', whiteSpace: 'pre-line' }}>
          How it works: <br />
          1.{' '}
          <a
            href="https://www.patreon.com/one_army"
            target="_blank"
            rel="noreferrer"
          >
            Support us
          </a>{' '}
          on Patreon <br />
          2. Connect your Patreon account by clicking below <br />
          3. You are now part of the special supporters club!
        </Text>
      )}
      <Flex>
        <Button
          onClick={patreonRedirect}
          mb={3}
          sx={{ justifyContent: 'center', mr: 3 }}
          variant="outline"
        >
          {user.patreon ? UPDATE_BUTTON_TEXT : CONNECT_BUTTON_TEXT}
        </Button>
        {user.patreon && (
          <Button
            onClick={removePatreonConnection}
            mb={3}
            sx={{ justifyContent: 'center' }}
            variant="outline"
          >
            {REMOVE_BUTTON_TEXT}
          </Button>
        )}
      </Flex>
    </FlexSectionContainer>
  )
}
