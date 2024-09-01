import { Flex, Image, Text } from 'theme-ui'

import { Category } from '../Category/Category'
import { MemberBadge } from '../MemberBadge/MemberBadge'
import { Username } from '../Username/Username'

import type { IProfileCreator } from './types'

interface IProps {
  creator: IProfileCreator
}

export const CardDetailsSpaceProfile = ({ creator }: IProps) => {
  const { _id, about, badges, countryCode, coverImage, profileType, subType } =
    creator

  const aboutTextStart =
    about && about.length > 80 ? about.slice(0, 78) + '...' : false

  return (
    <Flex sx={{ flexDirection: 'column', width: '100%' }}>
      {coverImage && (
        <Flex sx={{ flexDirection: 'column' }}>
          <Flex sx={{ aspectRatio: 16 / 6, overflow: 'hidden' }}>
            <Image
              src={coverImage}
              sx={{
                aspectRatio: 16 / 6,
                alignSelf: 'stretch',
                objectFit: 'cover',
              }}
            />
          </Flex>
          <MemberBadge
            profileType={profileType}
            size={40}
            sx={{
              alignSelf: 'flex-end',
              transform: 'translateY(-20px)',
              marginX: 2,
            }}
          />
        </Flex>
      )}
      <Flex
        sx={{
          alignItems: 'flex-start',
          flexDirection: 'column',
          gap: 1,
          transform: coverImage ? 'translateY(-20px)' : '',
          paddingX: 2,
          paddingY: coverImage ? 0 : 2,
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
            isLink={false}
          />
        </Flex>
        {subType && (
          <Category
            category={{ label: 'Wants to get started' }}
            sx={{
              border: '1px solid #0087B6',
              backgroundColor: '#ECFAFF',
              color: '#0087B6',
            }}
          />
        )}
        {about && (
          <Text variant="quiet" sx={{ fontSize: 2 }}>
            {aboutTextStart || about}
          </Text>
        )}
      </Flex>
    </Flex>
  )
}
