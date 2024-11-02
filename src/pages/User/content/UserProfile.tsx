import { useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { Button, InternalLink } from 'oa-components'
import { ProfileTypeList } from 'oa-shared'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { Flex, Text } from 'theme-ui'

import { MemberProfile } from './MemberProfile'
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
      () => userStore.activeUser?._id === profile._id,
      [userStore.activeUser?._id],
    )
    const showMemberProfile =
      profile.profileType === ProfileTypeList.MEMBER ||
      profile.profileType === undefined

    if (!profile) {
      return (
        <Text
          sx={{
            width: '100%',
            textAlign: 'center',
            display: 'block',
            marginTop: 10,
          }}
        >
          User not found
        </Text>
      )
    }

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

        {showMemberProfile ? (
          <MemberProfile
            data-cy="memberProfile"
            user={profile}
            docs={userCreatedDocs}
          />
        ) : (
          <SpaceProfile
            data-cy="spaceProfile"
            user={profile}
            docs={userCreatedDocs}
          />
        )}
      </Flex>
    )
  },
)
