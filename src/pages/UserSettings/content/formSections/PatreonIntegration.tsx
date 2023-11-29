import * as React from 'react'
import { PATREON_CLIENT_ID } from 'src/config/config'
import type { IUserPP } from 'src/models'
import { Heading, Flex, Image, Text, Box } from 'theme-ui'
import { Button } from 'oa-components'
import { FlexSectionContainer } from './elements'

export const PatreonIntegration = ({ user }: { user: IUserPP }) => {
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
    <FlexSectionContainer>
      <Heading variant="small">❤️ Become a Supporter</Heading>
      <Text mt={4}>
        Support us on Patreon to get a badge here on the platform and special
        insights and voting rights on decisions.
      </Text>
      <Text mt={4}>
        This feature is still in beta and we will continue to roll out more
        features for supporters.
      </Text>
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
            <Text>Successfully linked patron account!</Text>
          </Flex>
          {user.patreon.membership && (
            <Flex sx={{ flexDirection: 'column' }}>
              <Text mt={4}>Thanks for your support :) </Text>
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
          1. Support us on Patreon <br />
          2. Connect your Patreon account by clicking below <br />
          3. You are now part of the special supporters club!
        </Text>
      )}
      <Button
        large
        onClick={patreonRedirect}
        mb={3}
        sx={{ width: '100%', justifyContent: 'center' }}
        variant="outline"
      >
        {user.patreon ? 'Sync User Data' : 'Log in with Patreon'}
      </Button>
    </FlexSectionContainer>
  )
}
