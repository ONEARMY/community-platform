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

  const descriptionElement = document.querySelector('meta[name="description"]')
  const descriptionContent =
    descriptionElement === null
      ? 'Not found'
      : descriptionElement.getAttribute('content')
  return (
    <div>
      <p>This page is a work in progress..</p>
      <h4>Some SEO data, for your viewing pleasure!</h4>
      <p>{'meta description: "' + descriptionContent + '"'}</p>
    </div>
  )
})

export default Dashboard
