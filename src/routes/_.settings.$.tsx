import { observer } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import Main from 'src/pages/common/Layout/Main'
import { SettingsPage } from 'src/pages/UserSettings/SettingsPage'
import { Flex, Text } from 'theme-ui'

import type { IUser, IUserDB } from 'oa-shared'

import '../styles/leaflet.css'

export async function clientLoader() {
  return null
}

export default function Index() {
  return (
    <Main style={{ flex: 1 }}>
      <Settings />
    </Main>
  )
}

const Settings = observer(() => {
  const { userStore } = useCommonStores().stores

  const currentUser = userStore.user as IUser

  if (!currentUser) {
    return (
      <Flex sx={{ justifyContent: 'center' }} mt="40px">
        <Text> You can only access the settings page if you are logged in</Text>
      </Flex>
    )
  }

  return <SettingsPage profile={currentUser as IUserDB} />
})
