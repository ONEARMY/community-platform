import * as React from 'react'
import { PATREON_CLIENT_ID } from 'src/config/config'
import type { IUserPP } from 'src/models'
import { Heading, Flex, Image, Text, Box } from 'theme-ui'
import { Button } from 'oa-components'
import { FlexSectionContainer } from './elements'
import { useCommonStores } from 'src/index'

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
            <Text>Successfully linked Patreon account!</Text>
          </Flex>
          {user.patreon.membership && (
            <Flex sx={{ flexDirection: 'column' }}>
              <Text mt={4}>
                Thanks for supporting us! :) Update your data if you changed you
                Patreon tiers or remove the connection below.
              </Text>
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
          sx={{ width: '40%', justifyContent: 'center', mr: 3 }}
          variant="outline"
        >
          {user.patreon ? 'Update Patreon Data' : 'Connect To Patreon'}
        </Button>
        {user.patreon && (
          <Button
            onClick={removePatreonConnection}
            mb={3}
            sx={{ width: '40%', justifyContent: 'center' }}
            variant="outline"
          >
            Remove Connection
          </Button>
        )}
      </Flex>
    </FlexSectionContainer>
  )
}
