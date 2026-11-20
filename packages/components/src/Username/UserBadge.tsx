import type { ProfileBadge } from 'oa-shared';
import { Image } from 'theme-ui';

interface IProps {
  badge: ProfileBadge;
}

export const UserBadge = ({ badge }: IProps) => {
  return (
    <Image
      src={badge.imageUrl}
      alt={badge.displayName}
      sx={{ height: 16, width: 'auto', objectFit: 'contain', flexShrink: 0 }}
      data-testid={`Username: ${badge.name} badge`}
    />
  );
};
