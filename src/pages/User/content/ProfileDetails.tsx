import { useEffect, useMemo, useState } from 'react'
import { UserStatistics, VisitorModal } from 'oa-components'
import { UserRole } from 'oa-shared'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { ProfileTags } from 'src/pages/common/ProfileTags'
import { mapPinService } from 'src/pages/Maps/map.service'
import { Box, Divider, Flex, Paragraph } from 'theme-ui'

import type { MapPin, Profile, UserCreatedDocs } from 'oa-shared'

interface IProps {
  docs: UserCreatedDocs
  profile: Profile
  selectTab: (target: string) => void
}

export const ProfileDetails = ({ docs, profile, selectTab }: IProps) => {
  const { about, tags, visitorPolicy } = profile
  const [showVisitorModal, setShowVisitorModal] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pin, setPin] = useState<MapPin | undefined>(undefined)

  useEffect(() => {
    const getPin = async () => {
      try {
        const pin = await mapPinService.getMapPinById(profile.id)
        if (pin) {
          setPin(pin)
        }
      } catch (error) {
        console.error(error)
      }
    }
    getPin()
  }, [profile.id])

  const hideVisitorDetails = (target?: string) => {
    setShowVisitorModal(false)
    if (target) {
      selectTab(target)
    }
  }

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
          {(tags || visitorPolicy) && (
            <ProfileTags
              tags={tags}
              showVisitorModal={() => setShowVisitorModal(true)}
              visitorPolicy={visitorPolicy}
              isSpace={profile.type?.isSpace || false}
            />
          )}
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
            margin: 0,
          }}
        />
        <AuthWrapper
          roleRequired={UserRole.BETA_TESTER}
          fallback={
            <UserStatistics
              profile={profile}
              pin={pin}
              libraryCount={docs?.projects.length || 0}
              usefulCount={userTotalUseful}
              researchCount={docs?.research.length || 0}
              questionCount={docs?.questions.length || 0}
              showViews={false}
            />
          }
        >
          <UserStatistics
            profile={profile}
            pin={pin}
            libraryCount={docs?.projects.length || 0}
            usefulCount={userTotalUseful}
            researchCount={docs?.research.length || 0}
            questionCount={docs?.questions.length || 0}
            showViews
          />
        </AuthWrapper>
      </Flex>
    </Box>
  )
}
