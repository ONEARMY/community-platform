import { MemberBadge, Username } from 'oa-components'
import { type IUser, ProfileTypeList } from 'oa-shared'
import DefaultMemberImage from 'src/assets/images/default_member.svg'
import { cdnImageUrl } from 'src/utils/cdnImageUrl'
import { getUserCountry } from 'src/utils/getUserCountry'
import { Avatar, Box, Flex, Heading } from 'theme-ui'

interface IProps {
  user: IUser
}

export const ProfileHeader = ({ user }: IProps) => {
  const { displayName, profileType, userImage } = user

  const profileImageSrc = userImage?.downloadUrl
    ? cdnImageUrl(userImage.downloadUrl)
    : DefaultMemberImage

  return (
    <Box sx={{ position: 'relative' }}>
      {profileType !== ProfileTypeList.MEMBER && (
        <Box
          sx={{
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 0,
            transform: 'translateY(-50%)',
          }}
        >
          <Box sx={{ display: ['none', 'none', 'block'] }}>
            <MemberBadge size={150} profileType={profileType} />
          </Box>
          <Box sx={{ display: ['none', 'block', 'none'] }}>
            <MemberBadge size={100} profileType={profileType} />
          </Box>
          <Box sx={{ display: ['block', 'none', 'none'] }}>
            <MemberBadge size={75} profileType={profileType} />
          </Box>
        </Box>
      )}
      <Flex sx={{ gap: 2, alignItems: 'center', paddingBottom: [2, 4] }}>
        {userImage?.downloadUrl && profileType !== ProfileTypeList.MEMBER && (
          <Avatar
            data-cy="userImage"
            src={cdnImageUrl(userImage.downloadUrl, { width: 50 })}
            sx={{
              objectFit: 'cover',
              width: '50px',
              height: '50px',
            }}
          />
        )}

        {profileType === ProfileTypeList.MEMBER && (
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
        )}
        <Flex sx={{ flexDirection: 'column' }}>
          <Username
            user={{
              ...user,
              countryCode: getUserCountry(user),
              isSupporter: !!user.badges?.supporter,
              isVerified: !!user.badges?.verified,
            }}
            sx={{ alignSelf: 'flex-start' }}
          />
          <Heading
            as="h1"
            color={'black'}
            style={{ wordBreak: 'break-word' }}
            data-cy="userDisplayName"
          >
            {displayName}
          </Heading>
        </Flex>
      </Flex>
    </Box>
  )
}
