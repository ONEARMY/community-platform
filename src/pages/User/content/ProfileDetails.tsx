import { useContext, useMemo, useState } from 'react'
import { TagList, UserStatistics, VisitorModal } from 'oa-components'
import { UserRole } from 'oa-shared'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { isModuleSupported, MODULE } from 'src/modules'
import { EnvironmentContext } from 'src/pages/common/EnvironmentContext'
import { Box, Divider, Flex, Paragraph } from 'theme-ui'

import type { Profile, UserCreatedDocs } from 'oa-shared'

interface IProps {
  docs: UserCreatedDocs
  profile: Profile
  selectTab: (target: string) => void
}

export const ProfileDetails = ({ docs, profile, selectTab }: IProps) => {
  const { about, tags, visitorPolicy, username } = profile
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

  const country = isMapModule ? profile?.country : undefined

  const userTotalUseful = useMemo(() => {
    if (!profile?.authorUsefulVotes) {
      return 0
    }

    return profile.authorUsefulVotes.reduce(
      (sum, vote) => sum + vote.voteCount,
      0,
    )
  }, [profile.authorUsefulVotes])

  return (
    <Box style={{ height: '100%' }}>
      <Flex
        sx={{
          alignItems: 'stretch',
          flexDirection: ['column', 'row', 'row'],
          gap: [2, 4, 4],
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
          {tags && <TagList tags={tags.map((t) => ({ label: t.name }))} />}
          {about && <Paragraph>{about}</Paragraph>}

          {visitorPolicy && (
            <VisitorModal
              show={showVisitorModal}
              hide={hideVisitorDetails}
              user={profile}
            />
          )}
        </Flex>
        <Divider
          sx={{
            width: ['100%', '1px', '1px'],
            height: ['1px', 'auto', 'auto'],
            alignSelf: 'stretch',
            border: ['none', '2px solid #0000001A', '2px solid #0000001A'],
            borderTop: '2px solid #0000001A',
            m: 0,
          }}
        />
        <Box>
          <AuthWrapper
            roleRequired={UserRole.BETA_TESTER}
            fallback={
              <UserStatistics
                userName={username}
                country={country}
                isVerified={!!profile.isVerified}
                isSupporter={!!profile.isSupporter}
                libraryCount={docs?.projects.length || 0}
                usefulCount={userTotalUseful}
                researchCount={docs?.research.length || 0}
                totalViews={0}
                questionCount={docs?.questions.length || 0}
              />
            }
          >
            <UserStatistics
              userName={username}
              country={country}
              isVerified={!!profile.isVerified}
              isSupporter={!!profile.isSupporter}
              libraryCount={docs?.projects.length || 0}
              usefulCount={userTotalUseful}
              researchCount={docs?.research.length || 0}
              totalViews={profile.totalViews || 0}
              questionCount={docs?.questions.length || 0}
            />
          </AuthWrapper>
        </Box>
      </Flex>
    </Box>
  )
}
