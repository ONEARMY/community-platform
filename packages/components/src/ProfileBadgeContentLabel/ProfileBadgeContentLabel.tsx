import { Flex, Text } from 'theme-ui';

import { UserBadge } from '../Username/UserBadge';

import type { ProfileBadge } from 'oa-shared';

export interface Props {
  profileBadge: ProfileBadge;
}

export const ProfileBadgeContentLabel = ({ profileBadge }: Props) => {
  return (
    <Flex
      data-cy="profileBadge"
      sx={{
        alignItems: 'center',
        fontSize: 1,
        color: '#555555',
        backgroundColor: 'softblue',
        paddingX: 1,
        paddingY: 1,
        borderRadius: 1,
        gap: 1,
      }}
    >
      <UserBadge badge={profileBadge} />
      <Text>only news</Text>
    </Flex>
  );
};
