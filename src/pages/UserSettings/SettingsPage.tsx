import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { SettingsFormWrapper } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { isPreciousPlastic } from 'src/config/config'
import { ProfileType } from 'src/modules/profile/types'
import { Box, Flex, Text } from 'theme-ui'

import { AccountSettingsSection } from './content/formSections/AccountSettings.section'
import { ImpactSection } from './content/formSections/Impact/Impact.section'
import { UserProfile } from './content/formSections/UserProfile.section'

import type { availableGlyphs } from 'oa-components'

export const SettingsPage = () => {
  const [defaultTab, setDefaultTab] = useState<number>(0)
  const { userStore } = useCommonStores().stores
  const { hash } = useLocation()

  const user = userStore.activeUser
  if (!user) return

  useEffect(() => {
    if (hash.includes('#impact')) {
      // Check below for the array index of the impactTab in tabs
      setDefaultTab(1)
    }
  }, [hash])

  const isMember = user.profileType === ProfileType.MEMBER
  const showImpactTab = !isMember && isPreciousPlastic()

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

  const tabs = showImpactTab
    ? [profileTab, impactTab, accountTab]
    : [profileTab, accountTab]

  return (
    <Box
      sx={{
        maxWidth: '1000px',
        width: '100%',
        alignSelf: 'center',
        paddingTop: [3, 5, 10],
      }}
    >
      <SettingsFormWrapper setDefaultTab={defaultTab} tabs={tabs} />
    </Box>
  )
}
