import { UserStatistics } from 'oa-components'
import { UserRole } from 'oa-shared'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { ProfileTags } from 'src/common/ProfileTags'
import { Box, Flex, Paragraph } from 'theme-ui'

import type { IUser } from 'oa-shared'
import type { UserCreatedDocs } from '../types'

interface IProps {
  docs: UserCreatedDocs
  user: IUser
}

export const ProfileDetails = ({ docs, user }: IProps) => {
  const { about, location, tags, userName } = user

  return (
    <Box>
      <Flex
        sx={{
          flexDirection: ['column', 'column', 'row'],
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: [0, 0, 6],
        }}
      >
        <Flex
          sx={{
            flexDirection: 'column',
            width: ['100%', '100%', '80%'],
            gap: 2,
          }}
        >
          {tags && <ProfileTags tagIds={tags} />}
          {about && <Paragraph>{about}</Paragraph>}
        </Flex>
        <Box
          sx={{
            width: ['auto', 'auto', '20%'],
            mt: [3, 3, 0],
          }}
        >
          <AuthWrapper
            roleRequired={UserRole.BETA_TESTER}
            fallback={
              <UserStatistics
                userName={userName}
                country={location?.country}
                isVerified={user.verified}
                isSupporter={!!user.badges?.supporter}
                libraryCount={docs?.library.length || 0}
                usefulCount={user.totalUseful || 0}
                researchCount={docs?.research.length || 0}
                totalViews={0}
              />
            }
          >
            <UserStatistics
              userName={userName}
              country={location?.country}
              isVerified={user.verified}
              isSupporter={!!user.badges?.supporter}
              libraryCount={docs?.library.length || 0}
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
