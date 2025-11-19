import { useId } from 'react';
import { Tooltip } from 'react-tooltip';
import { Image } from 'theme-ui';

import type { ProfileBadge } from 'oa-shared';

interface IProps {
  badge: ProfileBadge;
}

export const UserBadge = ({ badge }: IProps) => {
  const uuid = useId();

  return (
    <>
      <Image
        src={badge.imageUrl}
        sx={{ ml: 1, height: 16, width: 16 }}
        data-testid={`Username: ${badge.name} badge`}
        data-tooltip-id={uuid}
        data-tooltip-content={badge.displayName}
      />
      <Tooltip id={uuid} />
    </>
  );
};
