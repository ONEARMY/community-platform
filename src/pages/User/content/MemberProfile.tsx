import * as React from 'react'
import { Box, Image } from 'rebass/styled-components'
import 'src/assets/css/slick.min.css'
import DefaultMemberImage from 'src/assets/images/default_member.svg'
import { AdminContact } from 'src/components/AdminContact/AdminContact'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'
import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import FlagIconEvents from 'src/components/Icons/FlagIcon/FlagIcon'
import { Text } from 'src/components/Text'
import { IUserPP } from 'src/models/user_pp.models'
import Workspace from 'src/pages/User/workspace/Workspace'
import theme from 'src/themes/styled.theme'
import styled from 'styled-components'
import ProfileLink from './ProfileLink'
import { renderUserStatsBox } from '.'
import { IUploadedFileMeta } from 'src/stores/storage'

interface IProps {
  user: IUserPP
}

const UserContactInfo = styled.div`
  h6 {
    margin-top: ${theme.space[3]}px;
  }
  div {
    margin-bottom: ${theme.space[2]}px;
    margin-top: ${theme.space[3]}px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`

const ProfileWrapper = styled(Box)`
  position: relative;
  border: 2px solid black;
  border-radius: ${theme.space[2]}px;
  width: 100%;
  align-self: center;
`

const ProfileContentWrapper = styled(Flex)`
  background-color: ${theme.colors.white};
  border-radius: 10px;
`

const MemberBadge = styled(Image)`
  position: absolute;
  width: 48px;
  top: -24px;
  left: calc(50% - 24px);
`

const MemberPicture = styled(Image)`
  width: 120px;
  height: 120px;
  border-radius: 50%;
`

export const MemberProfile = ({ user }: IProps) => {
  const shouldRenderUserStatsBox =
    user.location?.latlng ||
    user.stats?.userCreatedHowtos ||
    user.stats?.userCreatedEvents

  const userLinks = user?.links.filter(
    linkItem => !['discord', 'forum'].includes(linkItem.label),
  )

  return (
    <ProfileWrapper width={[1, 3 / 4, 1 / 2]} mt={8} mb={6}>
      <MemberBadge src={Workspace.findWorkspaceBadge(user.profileType)} />
      <ProfileContentWrapper px={4} py={4}>
        <Box mr={3} minWidth="initial">
          <MemberPicture
            src={
              user.coverImages[0]
                ? (user.coverImages[0] as IUploadedFileMeta).downloadUrl
                : DefaultMemberImage
            }
          />
          {shouldRenderUserStatsBox && renderUserStatsBox(user)}
        </Box>
        <Flex flexDirection="column" mt={3} ml={3}>
          <Text>{user.userName}</Text>
          <Flex alignItems="center" mb={3}>
            {user.location ? (
              <FlagIconEvents code={user.location.countryCode} />
            ) : (
              user.country && (
                <FlagIconEvents code={user.country.toLowerCase()} />
              )
            )}
            <Heading medium bold color={'black'} ml={2}>
              {user.displayName}
            </Heading>
          </Flex>
          {user.about && (
            <Text
              preLine
              paragraph
              mt="0"
              mb="20px"
              color={theme.colors.grey}
              width={['80%', '100%']}
            >
              {user.about}
            </Text>
          )}

          {!!userLinks.length && (
            <UserContactInfo>
              <span>Contact & Links</span>
              {userLinks.map((link, i) => (
                <ProfileLink link={link} key={'Link-' + i} />
              ))}
            </UserContactInfo>
          )}
          <AuthWrapper roleRequired={'admin'}>
            <Box mt={3}>
              <AdminContact user={user} />
            </Box>
          </AuthWrapper>
        </Flex>
      </ProfileContentWrapper>
    </ProfileWrapper>
  )
}
