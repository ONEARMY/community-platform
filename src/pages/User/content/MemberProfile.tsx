import 'src/assets/css/slick.min.css'
import type { IUserPP } from 'src/models/user_pp.models'
import type { IUploadedFileMeta } from 'src/stores/storage'

import { Box, Image } from 'rebass/styled-components'
import DefaultMemberImage from 'src/assets/images/default_member.svg'
import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import { FlagIcon } from 'src/components/Icons/FlagIcon/FlagIcon'
import { Text } from 'src/components/Text'
import theme from 'src/themes/styled.theme'
import styled from 'styled-components'
import { UserStats } from "./UserStats"
import UserContactAndLinks from './UserContactAndLinks'
import Badge from 'src/components/Badge/Badge'

interface IProps {
  user: IUserPP,
  adminButton?: JSX.Element | React.Component
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

const MemberPicture = styled(Image)`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  max-width: none;
`

export const MemberProfile = ({ user, adminButton }: IProps) => {
  const userLinks = user?.links.filter(
    linkItem => !['discord', 'forum'].includes(linkItem.label),
    )

  const userCountryCode = user.location?.countryCode || user.country?.toLowerCase() || null
    
  return (
    <ProfileWrapper mt={8} mb={6}>
      <Badge profileType="member" size={50} style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        marginLeft: 50 * -.5,
        marginTop: 50 * -.5,
      }}/>
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
              <UserContactAndLinks links={userLinks}/>
                <Box mt={3}>
                  {adminButton}
                </Box>
        </Flex>
      </ProfileContentWrapper>
    </ProfileWrapper>
  )
}
