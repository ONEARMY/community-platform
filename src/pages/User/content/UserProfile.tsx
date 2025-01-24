import { useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { Button, InternalLink } from 'oa-components'
import { ProfileTypeList } from 'oa-shared'
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { Flex } from 'theme-ui'

import { SpaceProfile } from './SpaceProfile'

import type { IUserDB } from 'oa-shared'
import type { UserCreatedDocs } from '../types'

type UserProfileProps = {
  profile: IUserDB
  userCreatedDocs: UserCreatedDocs
}

/**
 * High level wrapper which loads state, then determines
 * whether to render a MemberProfile or SpaceProfile.
 */
export const UserProfile = observer(
  ({ profile, userCreatedDocs }: UserProfileProps) => {
    const { userStore } = useCommonStores().stores
    const isViewingOwnProfile = useMemo(
      () => userStore.activeUser?._id === profile?._id,
      [userStore.activeUser?._id],
    )
    const showMemberProfile =
      profile?.profileType === ProfileTypeList.MEMBER ||
      profile?.profileType === undefined

    return (
      <Flex
        sx={{
          alignSelf: 'center',
          maxWidth: showMemberProfile ? '42em' : '60em',
          flexDirection: 'column',
          width: '100%',
          marginTop: isViewingOwnProfile ? 4 : [6, 8],
          gap: 4,
        }}
      >
        {isViewingOwnProfile && (
          <InternalLink
            sx={{
              alignSelf: ['center', 'flex-end'],
              marginBottom: showMemberProfile ? [2, 0] : 0,
              zIndex: 2,
            }}
            to="/settings"
          >
            <Button type="button" data-cy="EditYourProfile">
              Edit Your Profile
            </Button>
          </InternalLink>
        )}

        <ClientOnly fallback={<></>}>
          {() => (
            <>
              <SpaceProfile
                user={profile}
                docs={userCreatedDocs}
                type={profile.profileType}
              />
            </>
          )}
        </ClientOnly>
      </Flex>
    )
  },
)
