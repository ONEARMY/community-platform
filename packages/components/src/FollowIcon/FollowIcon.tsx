import { useId } from 'react';
import { Box, ThemeUIStyleObject } from 'theme-ui';
import { Icon } from '../Icon/Icon';
import { Tooltip } from '../Tooltip/Tooltip';

export interface FollowIconProps {
  tooltip: string;
  sx?: ThemeUIStyleObject;
}

export const FollowIcon = ({ tooltip, sx }: FollowIconProps) => {
  const uuid = useId();

  return (
    <>
      <Box
        data-testid="follow-icon"
        data-cy="follow-icon"
        data-tooltip-id={uuid}
        data-tooltip-content={tooltip}
        role="img"
        aria-label={tooltip}
        sx={sx}
      >
        <Icon glyph="thunderbolt" />
      </Box>
      <Tooltip id={uuid} />
    </>
  );
};
