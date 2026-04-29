import type { MapPin } from 'oa-shared';
import { Avatar, Box, Flex, Image, Text } from 'theme-ui';
import defaultProfileImage from '../../assets/images/default_member.svg';
import { MemberBadge } from '../MemberBadge/MemberBadge';
import { ProfileTagsList } from '../ProfileTagsList/ProfileTagsList';
import { DisplayName } from '../Username/DisplayName';

interface IProps {
  item: MapPin;
  isLink: boolean;
  sendMessageButton?: React.ReactNode;
}

export const CardDetailsSpaceProfile = ({ item, isLink, sendMessageButton }: IProps) => {
  const { profile } = item;
  const coverImage =
    profile.coverImages && profile.coverImages[0] && profile.coverImages[0]?.publicUrl;
  const profileUrl = profile.photo?.publicUrl;
  const hasImage = coverImage || profileUrl;

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
        </>
      )}
      <Flex
        sx={{
          alignItems: 'flex-start',
          flexDirection: 'column',
          gap: 2,
          p: 3,
        }}
      >
        <Flex sx={{ gap: 2, minWidth: 0, width: '100%', alignItems: 'end' }}>
          <Box
            sx={{
              position: 'relative',
              width: '80px',
              height: '80px',
              flexShrink: 0,
              marginTop: '-40px',
            }}
          >
            <Avatar
              src={profileUrl || defaultProfileImage}
              sx={{
                width: '80px',
                height: '80px',
                objectFit: 'cover',
                flexShrink: 0,
                border: '3px solid white',
                boxSizing: 'border-box',
              }}
              loading="lazy"
            />
            <MemberBadge
              profileType={profile.type || undefined}
              size={22}
              sx={{ position: 'absolute', bottom: 0, right: 0, m: '3px' }}
            />
          </Box>
          <DisplayName
            user={{ ...profile, country: item.country }}
            sx={{ alignSelf: 'flex-start' }}
            isLink={isLink}
            target="_blank"
          />
        </Flex>

        {profile.tags && profile.tags.length > 0 && (
          <ProfileTagsList tags={profile.tags} isSpace={true} />
        )}

        {profile.about && (
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
            {profile.about}
          </Text>
        )}
        {sendMessageButton}
      </Flex>
    </Flex>
  );
};
