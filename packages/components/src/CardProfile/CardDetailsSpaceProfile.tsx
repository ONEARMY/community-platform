import { Box, Flex, Image, Text } from 'theme-ui'

import { MemberBadge } from '../MemberBadge/MemberBadge'
import { ProfileTagsList } from '../ProfileTagsList/ProfileTagsList'
import { Username } from '../Username/Username'

import type { IProfileCreator } from 'oa-shared'

interface IProps {
  creator: IProfileCreator
  isLink: boolean
}

export const CardDetailsSpaceProfile = ({ creator, isLink }: IProps) => {
  const { _id, about, badges, countryCode, coverImage, profileType, tags } =
    creator

  const aboutTextStart =
    about && about.length > 80 ? about.slice(0, 78) + '...' : false

  return (
    <Flex sx={{ flexDirection: 'column', width: '100%' }}>
      {coverImage && (
        <>
          <Flex sx={{ aspectRatio: 16 / 6, overflow: 'hidden' }}>
            <Image
              src={coverImage}
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
              profileType={profileType}
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
          {!coverImage && <MemberBadge profileType={profileType} size={30} />}
          <Username
            user={{
              userName: _id,
              countryCode,
              isVerified: badges?.verified || false,
              isSupporter: badges?.supporter || false,
            }}
            sx={{ alignSelf: 'flex-start' }}
            isLink={isLink}
            target="_blank"
          />
        </Flex>

        {tags && <ProfileTagsList tags={tags} isSpace={true} />}

        {about && (
          <Text variant="quiet" sx={{ fontSize: 2 }}>
            {aboutTextStart || about}
          </Text>
        )}
      </Flex>
    </Flex>
  )
}
