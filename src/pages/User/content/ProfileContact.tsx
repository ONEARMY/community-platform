import { ExternalLinkLabel } from 'oa-shared'
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only'
import { UserAction } from 'src/common/UserAction'
import { isMessagingBlocked, isUserContactable } from 'src/utils/helpers'
import { Box, Flex } from 'theme-ui'

import { UserContactFormAvailable } from '../contact'
import { UserContactForm } from '../contact/UserContactForm'
import { UserContactFormNotLoggedIn } from '../contact/UserContactFormNotLoggedIn'
import UserContactAndLinks from './UserContactAndLinks'

import type { IUser } from 'oa-shared'

interface IProps {
  user: IUser
  isViewingOwnProfile: boolean
}

export const ProfileContact = ({ user, isViewingOwnProfile }: IProps) => {
  const { links } = user

  const userLinks =
    links?.filter(
      (linkItem) =>
        ![ExternalLinkLabel.DISCORD, ExternalLinkLabel.FORUM].includes(
          linkItem.label,
        ),
    ) || []

  const isUserProfileContactable = !isUserContactable(user)
  const shouldShowContactOutput = !isMessagingBlocked()

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
      <UserContactAndLinks links={userLinks} />
    </Flex>
  )
}
