import type { ProfileType } from 'oa-shared';
import type { ImageProps, ThemeUIStyleObject } from 'theme-ui';
import { Image } from 'theme-ui';
import badge from '../../assets/icons/icon-star-active.svg';

export interface Props extends ImageProps {
  size?: number;
  profileType?: ProfileType;
  useLowDetailVersion?: boolean;
  sx?: ThemeUIStyleObject | undefined;
}

const MINIMUM_SIZE = 40;

export const MemberBadge = (props: Props) => {
  const { profileType, size, useLowDetailVersion, sx } = props;
  const badgeSize = size ? size : MINIMUM_SIZE;

  if (!profileType) {
    return null;
  }

  return (
    <Image
      loading="lazy"
      className="avatar"
      data-cy={`MemberBadge-${profileType.name}`}
      sx={{ width: badgeSize, borderRadius: '50%', ...sx }}
      width={badgeSize}
      height={badgeSize}
      title={profileType.displayName}
      src={
        badgeSize > MINIMUM_SIZE && !useLowDetailVersion
          ? profileType.imageUrl || badge
          : profileType.smallImageUrl || badge
      }
    />
  );
};
