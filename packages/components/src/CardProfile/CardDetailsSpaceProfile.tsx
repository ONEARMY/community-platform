import { Box, Flex, Image, Text } from 'theme-ui';

import { MemberBadge } from '../MemberBadge/MemberBadge';
import { ProfileTagsList } from '../ProfileTagsList/ProfileTagsList';
import { Username } from '../Username/Username';

import type { PinProfile } from 'oa-shared';

interface IProps {
  profile: PinProfile;
  isLink: boolean;
}

export const CardDetailsSpaceProfile = ({ profile, isLink }: IProps) => {
  const coverImage =
    profile.coverImages && profile.coverImages[0] && profile.coverImages[0]?.publicUrl;
  const profileUrl = profile.photo?.publicUrl;
  const hasImage = coverImage || profileUrl;

  const aboutText =
    profile.about && profile.about.length > 80 ? profile.about.slice(0, 78) + '...' : profile.about;

  return (
    <Flex data-testid="CardDetailsSpaceProfile" sx={{ flexDirection: 'column', width: '100%' }}>
      {hasImage && (
        <>
          <Flex sx={{ aspectRatio: 16 / 6, overflow: 'hidden' }}>
            <Image
              src={coverImage || profileUrl}
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
              profileType={profile.type || undefined}
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
          {!hasImage && <MemberBadge profileType={profile.type || undefined} size={30} />}
          <Username
            user={profile}
            sx={{ alignSelf: 'flex-start' }}
            isLink={isLink}
            target="_blank"
          />
        </Flex>

        {profile.tags && profile.tags.length > 0 && (
          <ProfileTagsList tags={profile.tags} isSpace={true} />
        )}

        {aboutText && (
          <Text variant="quiet" sx={{ fontSize: 2, wordBreak: 'break-word' }}>
            {aboutText}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
