import type { UpgradeBadge } from 'oa-shared';
import { trackEvent } from 'src/common/Analytics';
import type { ThemeUIStyleObject } from 'theme-ui';
import { Box, Image } from 'theme-ui';

interface Props {
  upgradeBadge: UpgradeBadge;
  onClick?: () => void;
  sx?: ThemeUIStyleObject;
  'data-cy'?: string;
}

export const UpgradeBadgeLink = ({
  upgradeBadge,
  onClick,
  sx,
  'data-cy': dataCy = 'upgrade-badge-link',
}: Props) => {
  return (
    <Box
      as="a"
      // @ts-expect-error - Box doesn't properly type 'as' prop with anchor attributes
      href={upgradeBadge.actionUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-cy={dataCy}
      onClick={() => {
        onClick?.();
        trackEvent({
          category: 'profiles',
          action: 'upgradeBadgeClicked',
          label: upgradeBadge.actionLabel,
        });
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        color: 'black',
        ...sx,
      }}
    >
      {upgradeBadge.actionLabel}
      {upgradeBadge.badge?.imageUrl && (
        <Image
          src={upgradeBadge.badge.imageUrl}
          sx={{ height: 20, width: 20 }}
          alt={upgradeBadge.badge.displayName || 'badge'}
        />
      )}
    </Box>
  );
};
