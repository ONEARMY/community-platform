import type { MapPin } from 'oa-shared';
import { Avatar, Box, Flex, Text } from 'theme-ui';
import defaultProfileImage from '../../assets/images/default_member.svg';
import { MemberBadge } from '../MemberBadge/MemberBadge';
import { ProfileTagsList } from '../ProfileTagsList/ProfileTagsList';
import { DisplayName } from '../Username/DisplayName';
import type { CardVariant } from './CardProfile';
import { SendMessageButton } from './SendMessageButton';

interface IProps {
  variant: CardVariant;
  item: MapPin;
  isLink: boolean;
}

export const CardDetailsMemberProfile = ({ variant, item, isLink }: IProps) => {
  const { profile } = item;
  const photoUrl = profile.photo?.publicUrl;
  const tagsBlock =
    profile.tags && profile.tags.length > 0 ? (
      <Flex sx={{ flexDirection: 'column', gap: 1, flex: 1, minWidth: 0, pt: 1 }}>
        <ProfileTagsList tags={profile.tags} isSpace={false} />
      </Flex>
    ) : null;

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
            user={{ ...profile, country: item.country }}
            sx={{ alignSelf: 'flex-start' }}
            isLink={isLink}
            target="_blank"
          />
          {variant === 'list' && tagsBlock}
        </Flex>
      </Flex>
      {variant === 'pin' && tagsBlock}
      {variant === 'pin' && profile.about && (
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
      {variant === 'pin' && <SendMessageButton item={item} />}
    </Flex>
  );
};
