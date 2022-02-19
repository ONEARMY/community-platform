import 'src/assets/css/slick.min.css'
import type { IUserPP } from 'src/models/user_pp.models'
import type { IUploadedFileMeta } from 'src/stores/storage'

import { Box, Image } from 'rebass/styled-components'
import DefaultMemberImage from 'src/assets/images/default_member.svg'
import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import { FlagIcon } from 'src/components/Icons/FlagIcon/FlagIcon'
import { Text } from 'src/components/Text'
import Workspace from 'src/pages/User/workspace/Workspace'
import theme from 'src/themes/styled.theme'
import styled from 'styled-components'
import ProfileLink from './ProfileLink'
import { UserStats } from "./UserStats"

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
  display: block;
  border: 2px solid black;
  border-radius: ${theme.space[2]}px;
  align-self: center;
  width: 100%;
  position: relative;
`

const ProfileContentWrapper = styled(Flex)`
  background-color: ${theme.colors.white};
  border-radius: 10px;
`

const MemberBadge = styled(Image)`
  position: absolute;
  width: 48px;
  top: -24px;
  left: 50%;
  margin-left: -24px;
`

const MemberPicture = styled(Image)`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  max-width: none;
`

export const MemberProfile = ({ user }: IProps) => {
  const userLinks = user?.links.filter(
    linkItem => !['discord', 'forum'].includes(linkItem.label),
    )

  const userCountryCode = user.location?.countryCode || user.country?.toLowerCase() || null
    
  return (
    <ProfileWrapper mt={8} mb={6}>
      <MemberBadge src={Workspace.findWorkspaceBadge(user.profileType)} />
      <ProfileContentWrapper px={4} py={4}>
        <Box mr={3} minWidth="initial" style={{flexGrow: 1}}>
          <MemberPicture
            src={
                user.coverImages[0]
                ? (user.coverImages[0] as IUploadedFileMeta).downloadUrl
                : DefaultMemberImage
            }
            />
          <UserStats user={user}/>
        </Box>
        <Flex flexDirection="column" mt={3} ml={3} style={{flexGrow: 1}}>
            <Text style={{wordWrap: 'break-word'}}>{user.userName}</Text>
            <Box alignItems="center" mb={3}>
              <Heading medium bold color={'black'} style={{wordWrap: 'break-word'}}>
                  {userCountryCode && (
                      <FlagIcon mr={2} code={userCountryCode} style={{display: 'inline-block'}} />
                  )}
                  {user.displayName}
              </Heading>
            </Box>
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
                <Box mt={3}>
                  {/* <AdminContact user={user} /> */}
                </Box>
        </Flex>
      </ProfileContentWrapper>
    </ProfileWrapper>
  )
}
