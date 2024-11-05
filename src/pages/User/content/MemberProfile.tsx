import { MemberBadge, Username, UserStatistics } from 'oa-components'
import { ExternalLinkLabel, ProfileTypeList, UserRole } from 'oa-shared'
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only'
import DefaultMemberImage from 'src/assets/images/default_member.svg'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { ProfileTags } from 'src/common/ProfileTags'
import { cdnImageUrl } from 'src/utils/cdnImageUrl'
import { getUserCountry } from 'src/utils/getUserCountry'
import { Avatar, Box, Card, Flex, Heading, Paragraph } from 'theme-ui'

import UserContactAndLinks from './UserContactAndLinks'
import UserCreatedDocuments from './UserCreatedDocuments'

import type { IUserDB } from 'oa-shared'
import type { UserCreatedDocs } from '../types'

interface IProps {
  docs: UserCreatedDocs
  user: IUserDB
}

export const MemberProfile = ({ docs, user }: IProps) => {
  const {
    about,
    badges,
    displayName,
    links,
    location,
    tags,
    totalUseful,
    total_views,
    userImage,
    userName,
  } = user
  const isVerified = user.verified

  const userLinks = (links || []).filter(
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
            <ClientOnly fallback={<></>}>
              {() => (
                <AuthWrapper
                  roleRequired={UserRole.BETA_TESTER}
                  fallback={
                    <UserStatistics
                      userName={userName}
                      country={location?.country}
                      isVerified={isVerified}
                      isSupporter={!!badges?.supporter}
                      howtoCount={docs?.howtos.length || 0}
                      researchCount={docs?.research.length || 0}
                      usefulCount={totalUseful || 0}
                      totalViews={0}
                      sx={{ alignSelf: 'stretch' }}
                    />
                  }
                >
                  <UserStatistics
                    userName={userName}
                    country={location?.country}
                    isVerified={isVerified}
                    isSupporter={!!badges?.supporter}
                    howtoCount={docs?.howtos.length || 0}
                    researchCount={docs?.research.length || 0}
                    usefulCount={totalUseful || 0}
                    sx={{ alignSelf: 'stretch' }}
                    totalViews={total_views || 0}
                  />
                </AuthWrapper>
              )}
            </ClientOnly>
          </Flex>
          <Flex
            sx={{ flexDirection: 'column', flexGrow: 2, gap: 2, width: '100%' }}
          >
            <Flex sx={{ alignItems: 'center' }}>
              <Username
                user={{
                  userName,
                  countryCode: getUserCountry(user),
                  isVerified,
                }}
              />
            </Flex>
            <Box sx={{ flexDirection: 'column' }}>
              <Heading
                as="h1"
                color={'black'}
                style={{ wordWrap: 'break-word' }}
                data-cy="userDisplayName"
              >
                {displayName}
              </Heading>
            </Box>

            {tags && <ProfileTags tagIds={tags} />}
            {about && <Paragraph>{about}</Paragraph>}
            <UserContactAndLinks links={userLinks} />
          </Flex>
        </Flex>
        <ClientOnly fallback={<></>}>
          {() => (
            <AuthWrapper roleRequired={UserRole.BETA_TESTER}>
              <UserCreatedDocuments docs={docs} />
            </AuthWrapper>
          )}
        </ClientOnly>
      </Card>
    </Flex>
  )
}
