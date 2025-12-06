import { useId } from 'react';
import { useNavigate } from 'react-router';
import { Box } from 'theme-ui';

import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Tooltip } from '../Tooltip/Tooltip';

import type { ThemeUIStyleObject } from 'theme-ui';
import type { availableGlyphs } from '../Icon/types';

export interface OptionalFollowButtonProps {
  iconFollow?: availableGlyphs;
  iconUnfollow?: availableGlyphs;
  labelFollow?: string;
  labelUnfollow?: string;
  showIconOnly?: boolean;
  small?: boolean;
  sx?: ThemeUIStyleObject;
  tooltipFollow?: string;
  tooltipUnfollow?: string;
  variant?: string;
}
export interface FollowButtonProps extends OptionalFollowButtonProps {
  hasUserSubscribed: boolean;
  isLoggedIn: boolean;
  onFollowClick: () => void;
}

export const FollowButton = (props: FollowButtonProps) => {
  const {
    hasUserSubscribed,
    isLoggedIn,
    iconFollow = 'thunderbolt',
    iconUnfollow = 'thunderbolt-grey',
    labelFollow = 'Follow',
    labelUnfollow = 'Following',
    onFollowClick,
    showIconOnly = false,
    sx,
    tooltipFollow = '',
    tooltipUnfollow = '',
    variant = 'outline',
  } = props;
  const navigate = useNavigate();
  const uuid = useId();

  const tooltipContent = hasUserSubscribed ? tooltipUnfollow : tooltipFollow;

  if (showIconOnly) {
    return (
      <>
        <Box
          data-testid={isLoggedIn ? 'follow-button' : 'follow-redirect'}
          data-cy={isLoggedIn ? 'follow-button' : 'follow-redirect'}
          data-tooltip-id={uuid}
          data-tooltip-content={isLoggedIn ? tooltipContent : 'Login to follow'}
          role="img"
          aria-label={hasUserSubscribed ? labelUnfollow : labelFollow}
          sx={sx}
        >
          <Icon glyph={hasUserSubscribed ? iconFollow : iconUnfollow} />
        </Box>
        <Tooltip id={uuid} />
      </>
    );
  }

  return (
    <>
      <Button
        type="button"
        data-testid={isLoggedIn ? 'follow-button' : 'follow-redirect'}
        data-cy={isLoggedIn ? 'follow-button' : 'follow-redirect'}
        data-tooltip-id={uuid}
        data-tooltip-content={isLoggedIn ? tooltipContent : 'Login to follow'}
        variant={variant}
        sx={{ fontSize: 2, ...sx }}
        onClick={() =>
          isLoggedIn
            ? onFollowClick()
            : navigate('/sign-in?returnUrl=' + encodeURIComponent(location.pathname))
        }
        icon={hasUserSubscribed ? iconFollow : iconUnfollow}
        showIconOnly={showIconOnly}
        small={!!props.small}
      >
        {hasUserSubscribed ? labelUnfollow : labelFollow}
      </Button>
      <Tooltip id={uuid} />
    </>
  );
};
