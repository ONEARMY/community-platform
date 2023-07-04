import { useEffect, useState } from 'react'
import type { RouteComponentProps } from 'react-router'
import { Loader } from 'oa-components'
import { Text } from 'theme-ui'
import { observer } from 'mobx-react-lite'
import { useCommonStores } from 'src/index'
import { ProfileType } from 'src/modules/profile/types'
import { MemberProfile } from './MemberProfile'
import { SpaceProfile } from './SpaceProfile'
import type { IUserPP } from 'src/models'
import { logger } from '../../../logger'

interface IRouterCustomParams {
  id: string
}

interface IProps extends RouteComponentProps<IRouterCustomParams> {}

export interface UserCreatedDocs {
  howtos: any
  research: any
}

export const UserPage = observer((props: IProps) => {
  const { userStore, aggregationsStore } = useCommonStores().stores
  const [user, setUser] = useState<IUserPP | undefined>()
  const [userCreatedDocs, setUserCreatedDocs] = useState<
    UserCreatedDocs | undefined
  >()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const userid = props.match.params.id

    const fetchUserData = async () => {
      try {
        const userData = await userStore.getUserProfile(userid)
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
        const docs = await userStore.getUserCreatedDocs(userid)

        await setUserCreatedDocs(docs || null)
        setIsLoading(false)
      } catch (error) {
        logger.error('Error getting user created docs', error)
      }
    }
    fetchUserData()
    fetchUserDocs()
  }, [props.match.params.id])

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
