import 'src/assets/css/slick.min.css'
import type { IUserPP } from 'src/models/user_pp.models'
import type { IUploadedFileMeta } from 'src/stores/storage'

import { Box, Image, Text, Flex, Heading } from 'theme-ui'
import DefaultMemberImage from 'src/assets/images/default_member.svg'
import { FlagIcon, MemberBadge } from 'oa-components'
import theme from 'src/themes/styled.theme'
import styled from '@emotion/styled'
import { UserStats } from './UserStats'
import UserContactAndLinks from './UserContactAndLinks'
import { UserAdmin } from './UserAdmin'

interface IProps {
  user: IUserPP
}

const ProfileWrapper = styled(Box)`
  display: block;
  border: 2px solid black;
  border-radius: ${theme.space[2]}px;
  align-self: center;
  width: 100%;
  max-width: 42em;
  position: relative;
`

const ProfileContentWrapper = styled(Flex)`
  background-color: ${theme.colors.white};
  border-radius: 10px;
`

const MemberPicture = styled('figure')`
  display: block;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  max-width: none;
  overflow: hidden;

  img {
    outline: 100px solid red;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`

export const MemberProfile = ({ user }: IProps) => {
  const userLinks = user?.links.filter(
    (linkItem) => !['discord', 'forum'].includes(linkItem.label),
  )

  const userCountryCode =
    user.location?.countryCode || user.country?.toLowerCase() || null

  return (
    <ProfileWrapper mt={8} mb={6} data-cy="MemberProfile">
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
      />
      <ProfileContentWrapper px={4} py={4}>
        <Box mr={3} style={{ flexGrow: 1, minWidth: 'initial' }}>
          <MemberPicture>
            <Image
              src={
                user.coverImages[0]
                  ? (user.coverImages[0] as IUploadedFileMeta).downloadUrl
                  : DefaultMemberImage
              }
            />
          </MemberPicture>
          <UserStats user={user} />
        </Box>
        <Flex
          mt={3}
          ml={3}
          sx={{ flexGrow: 2, width: '100%', flexDirection: 'column' }}
        >
          <Flex
            sx={{
              alignItems: 'center',
              pt: ['40px', '40px', '0'],
            }}
          >
            {userCountryCode && (
              <FlagIcon
                mr={2}
                code={userCountryCode}
                style={{ display: 'inline-block' }}
              />
            )}
            <Text
              my={2}
              sx={{
                color: `${theme.colors.lightgrey} !important`,
                wordBreak: 'break-word',
                fontSize: 3,
              }}
              data-cy="userName"
            >
              {user.userName}
            </Text>
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
          {user.about && (
            <Text
              mt="0"
              mb="20px"
              color={theme.colors.grey}
              sx={{
                ...theme.typography.paragraph,
                whiteSpace: 'pre-line',
                width: ['80%', '100%'],
              }}
            >
              {user.about}
            </Text>
          )}
          <UserContactAndLinks links={userLinks} />
          <Box mt={3}>
            <UserAdmin user={user} />
          </Box>
        </Flex>
      </ProfileContentWrapper>
    </ProfileWrapper>
  )
}
