// eslint-disable-next-line import/no-unresolved
import { ProfileLink } from 'oa-components'
import { ClientOnly } from 'remix-utils/client-only'
import { UserAction } from 'src/common/UserAction'
import { isMessagingModuleOff, isUserContactable } from 'src/utils/helpers'
import { Box, Flex } from 'theme-ui'

import { UserContactFormAvailable } from '../contact'
import { UserContactForm } from '../contact/UserContactForm'
import { UserContactFormNotLoggedIn } from '../contact/UserContactFormNotLoggedIn'

import type { Profile } from 'oa-shared'

interface IProps {
  user: Profile
  isViewingOwnProfile: boolean
}

export const ProfileContact = ({ user, isViewingOwnProfile }: IProps) => {
  const isUserProfileContactable = !isUserContactable(user)
  const shouldShowContactOutput = !isMessagingModuleOff()

  return (
    <Flex sx={{ flexDirection: 'column', gap: 2 }}>
      {shouldShowContactOutput && (
        <Box data-cy="UserContactWrapper">
          <ClientOnly fallback={<></>}>
            {() => (
              <UserAction
                loggedIn={
                  isViewingOwnProfile ? (
                    <UserContactFormAvailable
                      isUserProfileContactable={!isUserProfileContactable}
                    />
                  ) : (
                    <UserContactForm user={user} />
                  )
                }
                loggedOut={
                  isUserProfileContactable ? (
                    <UserContactFormNotLoggedIn user={user} />
                  ) : (
                    <UserContactFormNotLoggedIn user={user} />
                  )
                }
              />
            )}
          </ClientOnly>
        </Box>
      )}

      {user.website && (
        <Box>
          <span>Website</span>
          <ProfileLink url={user.website} />
        </Box>
      )}
    </Flex>
  )
}
