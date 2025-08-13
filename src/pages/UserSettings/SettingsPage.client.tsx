import { useContext } from 'react'
import { observer } from 'mobx-react'
import { SettingsFormWrapper } from 'oa-components'
import { isPreciousPlastic } from 'src/config/config'
import { isModuleSupported, MODULE } from 'src/modules'
import { useProfileStore } from 'src/stores/Profile/profile.store'
import { isProfileComplete } from 'src/utils/isProfileComplete'
import { Box, Flex, Text } from 'theme-ui'

import { EnvironmentContext } from '../common/EnvironmentContext'
import { SettingsPageAccount } from './SettingsPageAccount'
import { SettingsPageImpact } from './SettingsPageImpact'
import { SettingsPageMapPin } from './SettingsPageMapPin'
import { SettingsPageNotifications } from './SettingsPageNotifications'
import { SettingsPageUserProfile } from './SettingsPageUserProfile'

import type { availableGlyphs, ITab } from 'oa-components'

import '../../styles/leaflet.css'

export const SettingsPage = observer(() => {
  const env = useContext(EnvironmentContext)
  const { profile } = useProfileStore()

  if (!profile) {
    return null
  }

  const isMember = !profile.type?.isSpace
  const showImpactTab = !isMember && isPreciousPlastic()
  const showMapTab = isModuleSupported(
    env?.VITE_SUPPORTED_MODULES || '',
    MODULE.MAP,
  )
  const incompleteProfile = !isProfileComplete(profile || undefined)

  const profileTab = {
    title: 'Profile',
    header: incompleteProfile && (
      <Flex
        sx={{ gap: 2, flexDirection: 'column' }}
        data-cy="CompleteProfileHeader"
      >
        <Text as="h3">✏️ Complete your profile</Text>
        <Text>
          In order to post comments or create content, we'd like you to share
          something about yourself.
        </Text>
      </Flex>
    ),
    body: <SettingsPageUserProfile />,
    glyph: 'profile' as availableGlyphs,
  }

  const mapTab = {
    title: 'Map',
    body: <SettingsPageMapPin />,
    glyph: 'map' as availableGlyphs,
  }

  const impactTab = {
    title: 'Impact',
    body: <SettingsPageImpact />,
    glyph: 'impact' as availableGlyphs,
  }

  const NotificationsTabs = {
    title: 'Notifications',
    body: <SettingsPageNotifications />,
    glyph: 'megaphone' as availableGlyphs,
  }

  const accountTab = {
    title: 'Account',
    body: <SettingsPageAccount />,
    glyph: 'account' as availableGlyphs,
  }

  const tabs = [
    profileTab,
    showMapTab ? mapTab : undefined,
    showImpactTab ? impactTab : undefined,
    NotificationsTabs,
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
})
