import { Loader, SettingsFormWrapper } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { Flex, Text } from 'theme-ui'

import { UserProfile } from './content/formSections/UserProfile.section'

export const SettingsPage = () => {
  const { userStore } = useCommonStores().stores
  const user = userStore.activeUser

  return user ? (
    <SettingsFormWrapper
      sx={{ maxWidth: '850px', alignSelf: 'center', paddingTop: [1, 5] }}
      tabs={[
        {
          title: 'Profile',
          header: (
            <Flex sx={{ gap: 2, flexDirection: 'column' }}>
              <Text as="h3">✏️ Complete your profile</Text>
              <Text>
                In order to post comments or create content, we'd like you to
                share something about yourself.
              </Text>
            </Flex>
          ),
          body: <UserProfile />,
          glyph: 'thunderbolt',
        },
      ]}
    />
  ) : (
    <Loader />
  )
}
