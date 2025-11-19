import { Avatar, Box, Flex } from 'theme-ui';

import defaultProfileImage from '../../assets/images/default_member.svg';
import { MemberBadge } from '../MemberBadge/MemberBadge';
import { ProfileTagsList } from '../ProfileTagsList/ProfileTagsList';
import { Username } from '../Username/Username';

import type { PinProfile } from 'oa-shared';

interface IProps {
  profile: PinProfile;
  isLink: boolean;
}

export const CardDetailsMemberProfile = ({ profile, isLink }: IProps) => {
  const photoUrl = profile.photo?.publicUrl;

  return (
    <Flex
      data-testid="CardDetailsMemberProfile"
      sx={{
        gap: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
        alignContent: 'stretch',
      }}
    >
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

      <Flex sx={{ flexDirection: 'column', gap: 1, flex: 1 }}>
        <Username user={profile} sx={{ alignSelf: 'flex-start' }} isLink={isLink} target="_blank" />
        {profile.tags && profile.tags.length > 0 && (
          <ProfileTagsList tags={profile.tags} isSpace={false} />
        )}
      </Flex>
    </Flex>
  );
};
