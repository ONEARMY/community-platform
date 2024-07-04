import { MemberBadge, Username, UserStatistics } from '@onearmy.apps/components'
import { ExternalLinkLabel, UserRole } from '@onearmy.apps/shared'
import { Avatar, Box, Card, Flex, Heading, Paragraph } from 'theme-ui'

import DefaultMemberImage from '../../../assets/images/default_member.svg'
import { AuthWrapper } from '../../../common/AuthWrapper'
import { getUserCountry } from '../../../utils/getUserCountry'
import UserContactAndLinks from './UserContactAndLinks'
import UserCreatedDocuments from './UserCreatedDocuments'

import type { IUserPP } from '../../../models/userPreciousPlastic.models'
import type { IUploadedFileMeta } from '../../../stores/storage'
import type { UserCreatedDocs } from '../types'

interface IProps {
  user: IUserPP
  docs: UserCreatedDocs | undefined
}

export const MemberProfile = ({ user, docs }: IProps) => {
  const userLinks = (user?.links || []).filter(
    (linkItem) =>
      ![ExternalLinkLabel.DISCORD, ExternalLinkLabel.FORUM].includes(
        linkItem.label,
      ),
  )

  const memberPictureSource =
    user.coverImages && user.coverImages[0]
      ? (user.coverImages[0] as IUploadedFileMeta).downloadUrl
      : DefaultMemberImage

  return (
    <Card
      data-cy="MemberProfile"
      sx={{
        position: 'relative',
        overflow: 'visible',
        maxWidth: '42em',
        width: '100%',
        margin: '0 auto',
        marginTop: [6, 8],
        padding: 2,
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
            loading="lazy"
            src={memberPictureSource}
            sx={{
              objectFit: 'cover',
              width: '120px',
              height: '120px',
            }}
          />
          <UserStatistics
            userName={user.userName}
            country={user.location?.country}
            isVerified={user.verified}
            isSupporter={!!user.badges?.supporter}
            howtoCount={docs?.howtos.length || 0}
            researchCount={docs?.research.length || 0}
            usefulCount={user.totalUseful || 0}
            sx={{ alignSelf: 'stretch' }}
          />
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
  )
}
