import type { PinProfile } from 'oa-shared';
import { Avatar, Box, Flex, Text } from 'theme-ui';
import defaultProfileImage from '../../assets/images/default_member.svg';
import { MemberBadge } from '../MemberBadge/MemberBadge';
import { ProfileTagsList } from '../ProfileTagsList/ProfileTagsList';
import { DisplayName } from '../Username/DisplayName';

interface IProps {
  profile: PinProfile;
  isLink: boolean;
  variant?: 'pin' | 'list';
}

export const CardDetailsMemberProfile = ({ profile, isLink, variant = 'pin' }: IProps) => {
  const photoUrl = profile.photo?.publicUrl;
  const aboutText =
    profile.about && profile.about.length > 80 ? profile.about.slice(0, 78) + '...' : profile.about;

  return (
    <Flex
      data-testid="CardDetailsMemberProfile"
      sx={{
        gap: 2,
        justifyContent: 'center',
        alignItems: 'start',
        p: 3,
        alignContent: 'stretch',
        flexDirection: 'column',
      }}
    >
      <Flex sx={{ gap: 2, alignItems: 'center' }}>
        <Box sx={{ aspectRatio: 1, width: '60px', height: '60px' }}>
          <Flex
            sx={{
              alignContent: 'flex-start',
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
            }}
          >
            <Avatar
              src={photoUrl || defaultProfileImage}
              sx={{ width: '60px', height: '60px', objectFit: 'cover' }}
              loading="lazy"
            />
            <MemberBadge
              profileType={profile.type || undefined}
              size={22}
              sx={{ transform: 'translateY(-22px)' }}
            />
          </Flex>
        </Box>
        <Flex sx={{ flexDirection: 'column' }}>
          <DisplayName
            user={profile}
            sx={{ alignSelf: 'flex-start' }}
            isLink={isLink}
            target="_blank"
          />
          {variant == 'list' && (
            <Flex sx={{ flexDirection: 'column', gap: 1, flex: 1, minWidth: 0, pt: 1 }}>
              {profile.tags && profile.tags.length > 0 && (
                <ProfileTagsList tags={profile.tags} isSpace={false} />
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
      {variant == 'pin' && (
        <Flex sx={{ flexDirection: 'column', gap: 1, flex: 1, minWidth: 0, pt: 1 }}>
          {profile.tags && profile.tags.length > 0 && (
            <ProfileTagsList tags={profile.tags} isSpace={false} />
          )}
        </Flex>
      )}
      {variant == 'pin' && aboutText && (
        <Text
          variant="quiet"
          sx={{
            fontSize: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            wordBreak: 'break-word',
          }}
        >
          {aboutText}
        </Text>
      )}
    </Flex>
  );
};
