import { ExternalLinkLabel } from 'oa-shared'
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only'
import { UserAction } from 'src/common/UserAction'
import { isUserContactable } from 'src/utils/helpers'
import { Flex } from 'theme-ui'

import { UserContactFormAvailable, UserContactNotLoggedIn } from '../contact'
import { UserContactForm } from '../contact/UserContactForm'
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

  return (
    <Flex sx={{ flexDirection: 'column', gap: 2 }}>
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
                <UserContactNotLoggedIn displayName={user.displayName} />
              ) : (
                <UserContactNotLoggedIn displayName={user.displayName} />
              )
            }
          />
        )}
      </ClientOnly>
      <UserContactAndLinks links={userLinks} />
    </Flex>
  )
}
