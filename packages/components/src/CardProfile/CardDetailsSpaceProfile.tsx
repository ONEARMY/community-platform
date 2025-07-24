import { Box, Flex, Image, Text } from 'theme-ui'

import { MemberBadge } from '../MemberBadge/MemberBadge'
import { ProfileTagsList } from '../ProfileTagsList/ProfileTagsList'
import { Username } from '../Username/Username'

import type { MapPin } from 'oa-shared'

interface IProps {
  profile: NonNullable<MapPin['profile']>
  isLink: boolean
}

export const CardDetailsSpaceProfile = ({ profile, isLink }: IProps) => {
  const aboutText =
    profile.about && profile.about.length > 80
      ? profile.about.slice(0, 78) + '...'
      : profile.about

  return (
    <Flex sx={{ flexDirection: 'column', width: '100%' }}>
      {profile.photo?.publicUrl && (
        <>
          <Flex sx={{ aspectRatio: 16 / 6, overflow: 'hidden' }}>
            <Image
              src={profile.photo.publicUrl}
              sx={{
                aspectRatio: 16 / 6,
                alignSelf: 'stretch',
                objectFit: 'cover',
              }}
              loading="lazy"
            />
          </Flex>
          <Box
            sx={{
              position: 'relative',
              height: 0,
              top: '-20px',
              width: '100%',
            }}
          >
            <MemberBadge
              profileType={profile.type}
              size={40}
              sx={{
                float: 'right',
                marginX: 2,
              }}
            />
          </Box>
        </>
      )}
      <Flex
        sx={{
          alignItems: 'flex-start',
          flexDirection: 'column',
          gap: 1,
          padding: 2,
        }}
      >
        <Flex sx={{ gap: 2 }}>
          {!profile.photo?.publicUrl && (
            <MemberBadge profileType={profile.type} size={30} />
          )}
          <Username
            user={{
              userName: profile.username,
              countryCode: profile.country,
              isVerified: profile.isVerified || false,
              isSupporter: profile.isContactable || false,
            }}
            sx={{ alignSelf: 'flex-start' }}
            isLink={isLink}
            target="_blank"
          />
        </Flex>

        {profile.tags && profile.tags.length > 0 && (
          <ProfileTagsList tags={profile.tags} isSpace={true} />
        )}

        {profile.about && (
          <Text variant="quiet" sx={{ fontSize: 2 }}>
            {aboutText}
          </Text>
        )}
      </Flex>
    </Flex>
  )
}
