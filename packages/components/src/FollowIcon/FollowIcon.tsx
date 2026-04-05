import { useId } from 'react';
import { Box, ThemeUIStyleObject } from 'theme-ui';
import { Icon } from '../Icon/Icon';
import { Tooltip, type TooltipProps } from '../Tooltip/Tooltip';

export interface FollowIconProps {
  tooltip: string;
  sx?: ThemeUIStyleObject;
  tooltipProps?: Omit<TooltipProps, 'id'>;
}

export const FollowIcon = ({ tooltip, sx, tooltipProps }: FollowIconProps) => {
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
      <Tooltip id={uuid} {...tooltipProps} />
    </>
  );
};
