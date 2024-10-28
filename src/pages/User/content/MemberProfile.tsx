import { MemberBadge, Username, UserStatistics } from 'oa-components'
import { ExternalLinkLabel, ProfileTypeList, UserRole } from 'oa-shared'
import DefaultMemberImage from 'src/assets/images/default_member.svg'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { cdnImageUrl } from 'src/utils/cdnImageUrl'
import { getUserCountry } from 'src/utils/getUserCountry'
import { Avatar, Box, Card, Flex, Heading, Paragraph } from 'theme-ui'

import UserContactAndLinks from './UserContactAndLinks'
import UserCreatedDocuments from './UserCreatedDocuments'

import type { IUserDB } from 'oa-shared'
import type { UserCreatedDocs } from '../types'

interface IProps {
  docs: UserCreatedDocs | undefined
  user: IUserDB
}

export const MemberProfile = ({ docs, user }: IProps) => {
  const { userImage } = user

  const userLinks = (user?.links || []).filter(
    (linkItem) =>
      ![ExternalLinkLabel.DISCORD, ExternalLinkLabel.FORUM].includes(
        linkItem.label,
      ),
  )

  const profileImageSrc = userImage?.downloadUrl
    ? cdnImageUrl(userImage.downloadUrl)
    : DefaultMemberImage

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        transform: 'translateY(-50px)',
      }}
    >
      <MemberBadge
        profileType={ProfileTypeList.MEMBER}
        size={50}
        sx={{
          alignSelf: 'center',
          transform: 'translateY(25px)',
        }}
        useLowDetailVersion
      />
      <Card
        data-cy="MemberProfile"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: 2,
        }}
      >
        <Flex
          sx={{
            flexDirection: ['column', 'row'],
            gap: [2, 4],
            padding: [2, 4],
            paddingTop: 4,
            width: '100%',
          }}
        >
          <Flex
            sx={{
              flexGrow: 1,
              minWidth: 'initial',
              alignItems: 'center',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <Avatar
              data-cy="profile-avatar"
              loading="lazy"
              src={profileImageSrc}
              sx={{
                objectFit: 'cover',
                width: '120px',
                height: '120px',
              }}
            />
            <AuthWrapper
              roleRequired={UserRole.BETA_TESTER}
              fallback={
                <UserStatistics
                  userName={user.userName}
                  country={user.location?.country}
                  isVerified={user.verified}
                  isSupporter={!!user.badges?.supporter}
                  howtoCount={docs?.howtos.length || 0}
                  researchCount={docs?.research.length || 0}
                  usefulCount={user.totalUseful || 0}
                  totalViews={0}
                  sx={{ alignSelf: 'stretch' }}
                />
              }
            >
              <UserStatistics
                userName={user.userName}
                country={user.location?.country}
                isVerified={user.verified}
                isSupporter={!!user.badges?.supporter}
                howtoCount={docs?.howtos.length || 0}
                researchCount={docs?.research.length || 0}
                usefulCount={user.totalUseful || 0}
                sx={{ alignSelf: 'stretch' }}
                totalViews={user.total_views || 0}
              />
            </AuthWrapper>
          </Flex>
          <Flex sx={{ flexGrow: 2, width: '100%', flexDirection: 'column' }}>
            <Flex
              sx={{
                alignItems: 'center',
                pt: [2, 0],
              }}
            >
              <Username
                user={{
                  userName: user.userName,
                  countryCode: getUserCountry(user),
                  isVerified: user.verified,
                }}
              />
            </Flex>
            <Box sx={{ flexDirection: 'column' }} mb={3}>
              <Heading
                as="h1"
                color={'black'}
                style={{ wordWrap: 'break-word' }}
                data-cy="userDisplayName"
              >
                {user.displayName}
              </Heading>
            </Box>
            {user.about && <Paragraph>{user.about}</Paragraph>}
            <UserContactAndLinks links={userLinks} />
          </Flex>
        </Flex>
        <AuthWrapper roleRequired={UserRole.BETA_TESTER}>
          <UserCreatedDocuments docs={docs} />
        </AuthWrapper>
      </Card>
    </Flex>
  )
}
