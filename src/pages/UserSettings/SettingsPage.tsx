import { SettingsFormWrapper } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { isPreciousPlastic } from 'src/config/config'
import { isModuleSupported, MODULE } from 'src/modules'
import { ProfileType } from 'src/modules/profile/types'
import { Box, Flex, Text } from 'theme-ui'

import { AccountSettingsSection } from './content/formSections/AccountSettings.section'
import { ImpactSection } from './content/formSections/Impact/Impact.section'
import { SettingsMapPinSection } from './content/formSections/SettingsMapPin.section'
import { UserProfile } from './content/formSections/UserProfile.section'

import type { availableGlyphs, ITab } from 'oa-components'

export const SettingsPage = () => {
  const { userStore } = useCommonStores().stores

  const user = userStore.activeUser
  if (!user) return

  const isMember = user.profileType === ProfileType.MEMBER
  const showImpactTab = !isMember && isPreciousPlastic()
  const showMapTab = isModuleSupported(MODULE.MAP)

  const profileTab = {
    title: 'Profile',
    header: (
      <Flex sx={{ gap: 2, flexDirection: 'column' }}>
        <Text as="h3">✏️ Complete your profile</Text>
        <Text>
          In order to post comments or create content, we'd like you to share
          something about yourself.
        </Text>
      </Flex>
    ),
    body: <UserProfile />,
    glyph: 'profile' as availableGlyphs,
  }

  const mapTab = {
    title: 'Map',
    body: <SettingsMapPinSection />,
    glyph: 'map' as availableGlyphs,
  }

  const impactTab = {
    title: 'Impact',
    body: <ImpactSection />,
    glyph: 'impact' as availableGlyphs,
  }

  const accountTab = {
    title: 'Account',
    body: <AccountSettingsSection />,
    glyph: 'account' as availableGlyphs,
  }

  const tabs = [
    profileTab,
    showMapTab ? mapTab : undefined,
    showImpactTab ? impactTab : undefined,
    accountTab,
  ].filter((tab) => tab !== undefined) as ITab[]

  return (
    <Box
      sx={{
        maxWidth: '1000px',
        width: '100%',
        alignSelf: 'center',
        paddingTop: [3, 5, 10],
      }}
    >
      <SettingsFormWrapper tabs={tabs} />
    </Box>
  )
}
