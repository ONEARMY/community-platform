import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Loader } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { ProfileType } from 'src/modules/profile/types'
import { Text } from 'theme-ui'

import { logger } from '../../../logger'
import { MemberProfile } from './MemberProfile'
import { SpaceProfile } from './SpaceProfile'

import type { IUserPP } from 'src/models'
import type { UserCreatedDocs } from '../types'

/**
 * High level wrapper which loads state, then determines
 * whether to render a MemberProfile or SpaceProfile.
 */
export const UserProfile = observer(() => {
  const { id } = useParams()
  const { userStore, aggregationsStore } = useCommonStores().stores
  const [user, setUser] = useState<IUserPP | undefined>()
  const [userCreatedDocs, setUserCreatedDocs] = useState<
    UserCreatedDocs | undefined
  >()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const userId = id

    if (userId) {
      const fetchUserData = async () => {
        try {
          const userData = await userStore.getUserProfile(userId)
          setUser(
            userData
              ? {
                  ...userData,
                }
              : null,
          )
        } catch (error) {
          logger.error('Error getting user profile', error)
        }
      }

      const fetchUserDocs = async () => {
        try {
          const docs = await userStore.getUserCreatedDocs(userId)

          await setUserCreatedDocs(docs || null)
          setIsLoading(false)
        } catch (error) {
          logger.error('Error getting user created docs', error)
        }
      }
      fetchUserData()
      fetchUserDocs()
    }
  }, [id])

  // Ensure aggregations up-to-date when using any child pages and unsubscribe when leaving
  useEffect(() => {
    aggregationsStore.updateAggregation('users_totalUseful')
    return () => {
      aggregationsStore.stopAggregationUpdates('users_totalUseful')
    }
  })

  if (isLoading) {
    return <Loader />
  }

  if (!user) {
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
    <>
      {user.profileType === ProfileType.MEMBER ||
      user.profileType === undefined ? (
        <MemberProfile
          data-cy="memberProfile"
          user={user}
          docs={userCreatedDocs}
        />
      ) : (
        <SpaceProfile
          data-cy="spaceProfile"
          user={user}
          docs={userCreatedDocs}
        />
      )}
    </>
  )
})
