import { useContext, useState } from 'react'
import { UserStatistics, VisitorModal } from 'oa-components'
import { UserRole } from 'oa-shared'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { ProfileTags } from 'src/common/ProfileTags'
import { isModuleSupported, MODULE } from 'src/modules'
import { EnvironmentContext } from 'src/pages/common/EnvironmentContext'
import { Box, Divider, Flex, Paragraph } from 'theme-ui'

import type { IUser } from 'oa-shared'
import type { UserCreatedDocs } from '../types'

interface IProps {
  docs: UserCreatedDocs
  user: IUser
  selectTab: (target: string) => void
}

export const ProfileDetails = ({ docs, user, selectTab }: IProps) => {
  const { about, location, tags, openToVisitors, userName } = user
  const [showVisitorModal, setShowVisitorModal] = useState(false)

  const hideVisitorDetails = (target?: string) => {
    setShowVisitorModal(false)
    if (target) {
      selectTab(target)
    }
  }

  const env = useContext(EnvironmentContext)
  const isMapModule = isModuleSupported(
    env?.VITE_SUPPORTED_MODULES || '',
    MODULE.MAP,
  )

  const country = isMapModule ? location?.country : undefined

  return (
    <Box style={{ height: '100%' }}>
      <Flex
        sx={{
          alignItems: 'stretch',
          flexDirection: ['column', 'column', 'row'],
          gap: [2, 2, 4],
          justifyContent: 'space-between',
        }}
      >
        <Flex
          sx={{
            flexDirection: 'column',
            flex: 1,
            gap: 2,
          }}
        >
          {(tags || openToVisitors) && (
            <ProfileTags
              tagIds={tags}
              showVisitorModal={() => setShowVisitorModal(true)}
              openToVisitors={openToVisitors}
            />
          )}
          {about && <Paragraph>{about}</Paragraph>}

          {openToVisitors && (
            <VisitorModal
              show={showVisitorModal}
              hide={hideVisitorDetails}
              user={user}
            />
          )}
        </Flex>
        <Divider
          sx={{
            width: ['100%', '100%', '1px'],
            height: ['1px', '1px', 'auto'],
            alignSelf: 'stretch',
            border: '2px solid #0000001A',
            m: 0,
          }}
        />
        <Box sx={{ marginTop: [3, 3, 0] }}>
          <AuthWrapper
            roleRequired={UserRole.BETA_TESTER}
            fallback={
              <UserStatistics
                userName={userName}
                country={country}
                isVerified={!!user.badges?.verified}
                isSupporter={!!user.badges?.supporter}
                libraryCount={docs?.projects.length || 0}
                usefulCount={user.totalUseful || 0}
                researchCount={docs?.research.length || 0}
                totalViews={0}
              />
            }
          >
            <UserStatistics
              userName={userName}
              country={country}
              isVerified={!!user.badges?.verified}
              isSupporter={!!user.badges?.supporter}
              libraryCount={docs?.projects.length || 0}
              usefulCount={user.totalUseful || 0}
              researchCount={docs?.research.length || 0}
              totalViews={user.total_views || 0}
            />
          </AuthWrapper>
        </Box>
      </Flex>
    </Box>
  )
}
