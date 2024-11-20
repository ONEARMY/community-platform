import { useContext } from 'react'
import { SettingsFormWrapper } from 'oa-components'
import { ProfileTypeList } from 'oa-shared'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { isPreciousPlastic } from 'src/config/config'
import { isModuleSupported, MODULE } from 'src/modules'
import { isProfileComplete } from 'src/utils/isProfileComplete'
import { Box, Flex, Text } from 'theme-ui'

import { EnvironmentContext } from '../common/EnvironmentContext'
import { SettingsPageAccount } from './SettingsPageAccount'
import { SettingsPageImpact } from './SettingsPageImpact'
import { SettingsPageMapPin } from './SettingsPageMapPin'
import { SettingsPageNotifications } from './SettingsPageNotifications'
import { SettingsPageUserProfile } from './SettingsPageUserProfile'

import type { availableGlyphs, ITab } from 'oa-components'
import type { IUserDB } from 'oa-shared'

type SettingsPageProps = {
  profile: IUserDB
}

export const SettingsPage = ({ profile }: SettingsPageProps) => {
  const env = useContext(EnvironmentContext)
  const { userStore } = useCommonStores().stores

  if (userStore.activeUser?._id !== profile._id) {
    return null
  }

  const isMember = profile.profileType === ProfileTypeList.MEMBER
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
    glyph: 'thunderbolt' as availableGlyphs,
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
}
