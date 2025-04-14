import { useLocation } from 'react-router-dom'
import { MemberBadge, Tab, TabPanel, Tabs, TabsList } from 'oa-components'
import { ProfileTypeList } from 'oa-shared'
import { isPreciousPlastic } from 'src/config/config'
import { isUserContactable } from 'src/utils/helpers'
import { Alert, Box, Card, Flex } from 'theme-ui'

import { Impact } from '../impact/Impact'
import { heading } from '../impact/labels'
import { ProfileContact } from './ProfileContact'
import { ProfileDetails } from './ProfileDetails'
import { ProfileHeader } from './ProfileHeader'
import { ProfileImage } from './ProfileImage'
import UserCreatedDocuments from './UserCreatedDocuments'

import type { IUser } from 'oa-shared'
import type { UserCreatedDocs } from '../types'

interface IProps {
  docs: UserCreatedDocs
  isViewingOwnProfile: boolean
  user: IUser
}

export const UserProfile = ({ docs, isViewingOwnProfile, user }: IProps) => {
  const { about, impact, links, profileType, tags } = user

  const useLocationHook = useLocation()

  const isMember = profileType === ProfileTypeList.MEMBER

  const hasContactOption =
    isUserContactable(user) || (links && Object.keys(links).length !== 0)
  const hasContributed = docs?.library.length + docs?.research.length > 0
  const hasImpacted = !!impact
  const hasProfile =
    about || (tags && Object.keys(tags).length !== 0) || hasContributed

  const showEmptyProfileAlert = isViewingOwnProfile && !hasProfile

  const defaultValue =
    useLocationHook?.hash?.slice(1) || (hasProfile ? 'profile' : 'contact')

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
          profileType={ProfileTypeList.MEMBER}
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
            gap: 2,
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

            <Tabs defaultValue={defaultValue}>
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
                <ProfileDetails docs={docs} user={user} />
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
                  <ProfileContact user={user} />
                </TabPanel>
              )}
            </Tabs>
          </Box>
        </Flex>
      </Card>
    </Flex>
  )
}
