import { observer } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { Flex, Text } from 'theme-ui'

import type { IUser } from 'src/models/user.models'

const Dashboard = observer(() => {
  const { userStore } = useCommonStores().stores
  const currentUser = userStore.user as IUser

  if (currentUser === null || currentUser === undefined) {
    return (
      <Flex sx={{ justifyContent: 'center' }} mt="40px">
        <Text>Please login to access this page</Text>
      </Flex>
    )
  }
  return <div>placeholder</div>
})

export default Dashboard
