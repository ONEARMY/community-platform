import * as React from 'react'
import { Button, Icon } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { PATREON_CLIENT_ID } from 'src/config/config'
import { Flex, Heading, Image, Text } from 'theme-ui'

export const HEADING = 'Patreon'
export const SUCCESS_MESSAGE = 'Successfully linked Patreon account!'
export const SUPPORTER_MESSAGE =
  'Thanks for supporting us! :) Update your data if you changed your Patreon tiers or remove the connection below.'

export const CONNECT_BUTTON_TEXT = 'Connect'
export const UPDATE_BUTTON_TEXT = 'Update'
export const REMOVE_BUTTON_TEXT = 'Disconnect'

export const PatreonIntegration = ({ user }) => {
  const { userStore } = useCommonStores().stores

  const removePatreonConnection = () => {
    if (!user) {
      return
    }
    userStore.removePatreonConnection(user.userName)
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
    <Flex
      sx={{
        alignItems: ['flex-start', 'flex-start', 'center'],
        backgroundColor: 'offwhite',
        borderRadius: 3,
        flexDirection: ['column', 'column', 'row'],
        justifyContent: 'space-between',
        padding: 4,
        gap: [2, 4],
      }}
    >
      <Icon glyph="patreon" size={45} />
      <Flex sx={{ flexDirection: 'column', flex: 1, gap: [2] }}>
        <Heading as="h2" variant="small">
          {HEADING}
        </Heading>
        {user.patreon ? (
          <>
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
            {user.badges?.supporter && user.patreon.membership && (
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
          </>
        ) : (
          <Text variant="quiet">
            As a supporter you get a badge on the platform, special insights and
            voting rights on decisions.
          </Text>
        )}
      </Flex>

      <Flex sx={{ flexDirection: 'column', gap: 2 }}>
        <Button type="button" onClick={patreonRedirect} variant="primary">
          {user.patreon ? UPDATE_BUTTON_TEXT : CONNECT_BUTTON_TEXT}
        </Button>
        {user.patreon && (
          <Button
            type="button"
            onClick={removePatreonConnection}
            variant="outline"
          >
            {REMOVE_BUTTON_TEXT}
          </Button>
        )}
      </Flex>
    </Flex>
  )
}
