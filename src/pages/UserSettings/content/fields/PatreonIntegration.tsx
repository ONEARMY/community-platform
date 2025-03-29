import { useEffect, useState } from 'react'
import { Button, Icon } from 'oa-components'
import { PATREON_CLIENT_ID } from 'src/config/config'
import { patreonService } from 'src/services/patreonService'
import { Flex, Heading, Image, Text } from 'theme-ui'

import type { IPatreonUser } from 'oa-shared'

export const HEADING = 'Patreon'
export const SUCCESS_MESSAGE = 'Successfully linked Patreon account!'
export const SUPPORTER_MESSAGE =
  'Thanks for supporting us! :) Update your data if you changed your Patreon tiers or remove the connection below.'

export const CONNECT_BUTTON_TEXT = 'Connect'
export const UPDATE_BUTTON_TEXT = 'Update'
export const REMOVE_BUTTON_TEXT = 'Disconnect'

export const PatreonIntegration = () => {
  const [patreonUser, setPatreon] = useState<{
    patreon: IPatreonUser
    isSupporter: boolean
  }>()

  useEffect(() => {
    const fetchPatreonData = async () => {
      const patreonUser = await patreonService.getCurrentUserPatreon()

      if (patreonUser) {
        setPatreon(patreonUser)
      }
    }

    fetchPatreonData()
  }, [])

  const removePatreonConnection = async () => {
    const result = await patreonService.disconnectUserPatreon()

    if (result) {
      setPatreon(undefined)
    }
  }

  const patreonRedirect = () => {
    // Redirect to patreon to get access code.
    const redirectUri = `${window.location.protocol}//${window.location.host}/patreon`

    window.location.assign(
      `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${PATREON_CLIENT_ID}&redirect_uri=${redirectUri}`,
    )
  }

  return (
    <Flex
      sx={{
        alignItems: ['flex-start', 'flex-start', 'flex-start'],
        backgroundColor: 'offWhite',
        borderRadius: 3,
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 4,
        gap: [2, 4],
      }}
    >
      <Flex sx={{ flexDirection: 'row', gap: [2, 4] }}>
        <Icon glyph="patreon" size={45} />
        <Flex sx={{ flexDirection: 'column', flex: 1, gap: [2] }}>
          <Heading as="h2" variant="small">
            {HEADING}
          </Heading>
          {patreonUser?.patreon ? (
            <>
              <Text>{SUCCESS_MESSAGE}</Text>
              {patreonUser?.isSupporter && patreonUser.patreon.membership && (
                <Flex sx={{ flexDirection: 'column' }}>
                  <Text mt={4}>{SUPPORTER_MESSAGE}</Text>
                  {patreonUser.patreon.membership.tiers.map(
                    ({ id, attributes }) => (
                      <Flex
                        key={id}
                        sx={{
                          alignItems: 'center',
                          mt: 4,
                        }}
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
                    ),
                  )}
                </Flex>
              )}
            </>
          ) : (
            <Text variant="quiet">
              As a supporter you get a badge on the platform, special insights
              and voting rights on decisions.
            </Text>
          )}
        </Flex>
      </Flex>

      <Flex sx={{ gap: 2 }}>
        <Button type="button" onClick={patreonRedirect} variant="primary">
          {patreonUser?.patreon ? UPDATE_BUTTON_TEXT : CONNECT_BUTTON_TEXT}
        </Button>
        {patreonUser?.patreon && (
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
