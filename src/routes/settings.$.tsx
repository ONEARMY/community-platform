import { observer } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import Main from 'src/pages/common/Layout/Main'
import { Layout } from 'src/pages/Layout'
import { SettingsPage } from 'src/pages/UserSettings/SettingsPage'
import { Flex, Text } from 'theme-ui'

import type { IUser } from 'src/models'

export async function clientLoader() {
  return null
}

export default function Index() {
  return (
    <Layout>
      <Main data-cy="main-layout-container" style={{ flex: 1 }}>
        <Settings />
      </Main>
    </Layout>
  )
}

const Settings = observer(() => {
  const { userStore } = useCommonStores().stores

  const currentUser = userStore.user as IUser
  return currentUser ? (
    <SettingsPage />
  ) : (
    <Flex sx={{ justifyContent: 'center' }} mt="40px">
      <Text> You can only access the settings page if you are logged in</Text>
    </Flex>
  )
})
