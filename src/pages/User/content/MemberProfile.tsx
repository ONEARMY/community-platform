import 'src/assets/css/slick.min.css'
import type { IUserPP } from 'src/models/userPreciousPlastic.models'
import type { IUploadedFileMeta } from 'src/stores/storage'
import { Box, Image, Flex, Heading, Card, Paragraph } from 'theme-ui'
import DefaultMemberImage from 'src/assets/images/default_member.svg'
import { MemberBadge, UserStatistics, Username } from 'oa-components'
import UserContactAndLinks from './UserContactAndLinks'
import { userStats } from 'src/common/hooks/userStats'
import UserCreatedDocuments from './UserCreatedDocuments'
import type { UserCreatedDocs } from '.'

interface IProps {
  user: IUserPP
  docs: UserCreatedDocs | undefined
}

export const MemberProfile = ({ user, docs }: IProps) => {
  const userLinks = (user?.links || []).filter(
    (linkItem) => !['discord', 'forum'].includes(linkItem.label),
  )

  const stats = userStats(user.userName)

  const userCountryCode =
    user.location?.countryCode || user.country?.toLowerCase() || undefined

  const memberPictureSource =
    user.coverImages && user.coverImages[0]
      ? (user.coverImages[0] as IUploadedFileMeta).downloadUrl
      : DefaultMemberImage

  return (
    <Card
      mt={8}
      mb={6}
      data-cy="MemberProfile"
      sx={{
        position: 'relative',
        overflow: 'visible',
        maxWidth: '42em',
        width: '100%',
        margin: '0 auto',
        backgroundColor: 'transparent',
      }}
    >
      <Flex
        sx={{
          px: [2, 4],
          py: 4,
          background: 'white',
        }}
      >
        <MemberBadge
          profileType="member"
          size={50}
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            marginLeft: 50 * -0.5,
            marginTop: 50 * -0.5,
          }}
          useLowDetailVersion
        />
        <Flex
          px={4}
          py={4}
          sx={{ borderRadius: 1, flexDirection: ['column', 'row'] }}
        >
          <Box sx={{ flexGrow: 1, minWidth: 'initial', mr: 3 }}>
            <Box
              sx={{
                display: 'block',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                maxWidth: 'none',
                overflow: 'hidden',
                margin: '0 auto',
                mb: 3,
              }}
            >
              <Image
                loading="lazy"
                src={memberPictureSource}
                sx={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                }}
              />
            </Box>
            <UserStatistics
              userName={user.userName}
              country={user.location?.country}
              isVerified={stats.verified}
              isSupporter={!!user.badges?.supporter}
              howtoCount={docs?.howtos.length || 0}
              researchCount={docs?.research.length || 0}
              usefulCount={stats.totalUseful}
            />
          </Box>
          <Flex
            mt={[0, 3]}
            ml={[0, 3]}
            sx={{ flexGrow: 2, width: '100%', flexDirection: 'column' }}
          >
            <Flex
              sx={{
                alignItems: 'center',
                pt: ['40px', '40px', '0'],
              }}
            >
              <Username
                user={{
                  userName: user.userName,
                  countryCode: userCountryCode,
                }}
                isVerified={stats.verified}
              />
            </Flex>
            <Box sx={{ flexDirection: 'column' }} mb={3}>
              <Heading
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
      </Flex>
      <UserCreatedDocuments docs={docs} />
    </Card>
  )
}
