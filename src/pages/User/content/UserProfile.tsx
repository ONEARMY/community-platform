import { useState } from 'react'
import { useLocation } from 'react-router'
import {
  MemberBadge,
  MemberHistory,
  Tab,
  TabPanel,
  Tabs,
  TabsList,
} from 'oa-components'
import { UserRole } from 'oa-shared'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { isPreciousPlastic } from 'src/config/config'
import { isContactable } from 'src/utils/helpers'
import { isProfileComplete } from 'src/utils/isProfileComplete'
import { Alert, Box, Card, Flex } from 'theme-ui'

import { Impact } from '../impact/Impact'
import { heading } from '../impact/labels'
import { ProfileContact } from './ProfileContact'
import { ProfileDetails } from './ProfileDetails'
import { ProfileHeader } from './ProfileHeader'
import { ProfileImage } from './ProfileImage'
import UserCreatedDocuments from './UserCreatedDocuments'

import type { Profile, UserCreatedDocs } from 'oa-shared'

interface IProps {
  docs: UserCreatedDocs
  isViewingOwnProfile: boolean
  user: Profile
}

export const UserProfile = ({ docs, isViewingOwnProfile, user }: IProps) => {
  const { about, impact, type, tags } = user
  const location = useLocation()
  const isMember = !type?.isSpace
  const hasContactOption = isContactable(user.isContactable) || !!user.website
  const hasContributed =
    docs?.projects.length + docs?.research.length + docs?.questions.length > 0
  const hasImpacted = !!impact
  const hasProfile =
    about || (tags && Object.keys(tags).length !== 0) || hasContributed

  const showEmptyProfileAlert = isViewingOwnProfile && !isProfileComplete(user)

  const defaultValue =
    location?.hash?.slice(1) || (hasProfile ? 'profile' : 'contact')

  const [selectedTab, setSelectedTab] = useState(defaultValue)

  return (
    <Flex
      data-cy={isMember ? 'MemberProfile' : 'SpaceProfile'}
      sx={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
      }}
    >
      {isMember && (
        <MemberBadge
          profileType={type || undefined}
          size={50}
          sx={{
            alignSelf: 'center',
            position: 'absolute',
            transform: 'translateY(-25px)',
          }}
          useLowDetailVersion
        />
      )}
      <Card variant="responsive" sx={{ borderRadius: [3, 3, 3] }}>
        <ProfileImage user={user} />
        <Flex
          sx={{
            borderTop: isMember ? '' : '2px solid',
            flexDirection: 'column',
            gap: 4,
            padding: [2, 4],
          }}
        >
          {showEmptyProfileAlert && (
            <Alert variant="info" data-cy="emptyProfileMessage">
              Oh hey! Your profile is looking SO empty. Fancy filling it in...?
            </Alert>
          )}

          <Box sx={{ width: '100%' }}>
            <ProfileHeader user={user} />

            <Tabs
              value={selectedTab}
              onChange={(_: any, value: string | number | null) => {
                typeof value === 'string' && setSelectedTab(value)
              }}
            >
              <TabsList>
                {hasProfile && <Tab value="profile">Profile</Tab>}
                {hasContributed && (
                  <Tab data-cy="ContribTab" value="contributions">
                    Contributions
                  </Tab>
                )}
                {hasImpacted && isPreciousPlastic() && (
                  <Tab data-cy="ImpactTab" value="impact">
                    {heading}
                  </Tab>
                )}
                {hasContactOption && (
                  <Tab data-cy="contact-tab" value="contact">
                    Contact
                  </Tab>
                )}
              </TabsList>
              <TabPanel value="profile">
                <ProfileDetails
                  docs={docs}
                  profile={user}
                  selectTab={setSelectedTab}
                />
              </TabPanel>
              {hasContributed && (
                <TabPanel value="contributions">
                  <UserCreatedDocuments docs={docs} />
                </TabPanel>
              )}
              {hasImpacted && isPreciousPlastic() && (
                <TabPanel value="impact">
                  <Impact impact={impact} user={user} />
                </TabPanel>
              )}
              {hasContactOption && (
                <TabPanel value="contact">
                  <ProfileContact
                    user={user}
                    isViewingOwnProfile={isViewingOwnProfile}
                  />
                </TabPanel>
              )}
            </Tabs>
          </Box>
          <AuthWrapper roleRequired={UserRole.BETA_TESTER}>
            <MemberHistory
              memberSince={user.createdAt}
              lastActive={user.lastActive}
            />
          </AuthWrapper>
        </Flex>
      </Card>
    </Flex>
  )
}
