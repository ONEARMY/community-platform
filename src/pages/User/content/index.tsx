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

const UserPage = observer((props: IProps) => {
  const { userStore, aggregationsStore } = useCommonStores().stores
  const [user, setUser] = useState<IUserPP | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const userid = props.match.params.id
    const fetchData = async () => {
      try {
        const userData = await userStore.getUserProfile(userid)
        setUser(userData ?? null)
        setIsLoading(false)
      } catch (error) {
        logger.error('Error getting user profile', error)
      }
    }
    fetchData()
  }, [props.match.params.id])

  useEffect(() => {
    // Ensure aggregations up-to-date when using any child pages
    aggregationsStore.updateAggregation('users_votedUsefulHowtos')
    aggregationsStore.updateAggregation('users_votedUsefulResearch')
    return () => {
      // Stop receiving updates when navigating away from child pages
      aggregationsStore.stopAggregationUpdates('users_votedUsefulHowtos')
      aggregationsStore.stopAggregationUpdates('users_votedUsefulResearch')
    }
  }, [aggregationsStore])

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
        <MemberProfile data-cy="memberProfile" user={user} />
      ) : (
        <SpaceProfile data-cy="spaceProfile" user={user} />
      )}
    </>
  )
})

export default UserPage
