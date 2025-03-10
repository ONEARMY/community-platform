import { ExternalLinkLabel } from 'oa-shared'
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only'
import { UserAction } from 'src/common/UserAction'
import { Flex } from 'theme-ui'

import { UserContactNotLoggedIn } from '../contact'
import { UserContactForm } from '../contact/UserContactForm'
import UserContactAndLinks from './UserContactAndLinks'

import type { IUser } from 'oa-shared'

interface IProps {
  user: IUser
}

export const ProfileContact = ({ user }: IProps) => {
  const { links } = user

  const userLinks =
    links?.filter(
      (linkItem) =>
        ![ExternalLinkLabel.DISCORD, ExternalLinkLabel.FORUM].includes(
          linkItem.label,
        ),
    ) || []

  return (
    <Flex sx={{ flexDirection: 'column', gap: 2 }}>
      <ClientOnly fallback={<></>}>
        {() => (
          <UserAction
            loggedIn={<UserContactForm user={user} />}
            loggedOut={
              <UserContactNotLoggedIn displayName={user.displayName} />
            }
          />
        )}
      </ClientOnly>
      <UserContactAndLinks links={userLinks} />
    </Flex>
  )
}
