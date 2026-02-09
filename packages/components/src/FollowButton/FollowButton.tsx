import { useId } from 'react';
import { useNavigate } from 'react-router';
import type { ThemeUIStyleObject } from 'theme-ui';
import { Button } from '../Button/Button';
import { Tooltip } from '../Tooltip/Tooltip';

export interface FollowButtonProps {
  isLoggedIn: boolean;
  onFollowClick: () => void;
  isFollowing?: boolean;
  labelFollow?: string;
  labelUnfollow?: string;
  tooltipFollow?: string;
  tooltipUnfollow?: string;
  small?: boolean;
  variant?: string;
  sx?: ThemeUIStyleObject;
}

export const FollowButton = (props: FollowButtonProps) => {
  const { isFollowing, isLoggedIn, labelFollow = 'Follow', labelUnfollow = 'Unfollow', onFollowClick, sx, variant = 'outline' } = props;
  const navigate = useNavigate();
  const uuid = useId();

  if (isFollowing === undefined) {
    return null;
  }

  return (
    <>
      <Button
        type="button"
        data-testid={isLoggedIn ? 'follow-button' : 'follow-redirect'}
        data-cy={isLoggedIn ? 'follow-button' : 'follow-redirect'}
        data-tooltip-id={uuid}
        data-tooltip-content={isFollowing ? props.tooltipFollow : props.tooltipUnfollow}
        variant={variant}
        sx={{ fontSize: 2, ...sx }}
        onClick={() => (isLoggedIn ? onFollowClick() : navigate('/sign-in?returnUrl=' + encodeURIComponent(location.pathname)))}
        icon={isFollowing ? 'thunderbolt' : 'thunderbolt-grey'}
        small={!!props.small}
      >
        {isFollowing ? labelUnfollow : labelFollow}
      </Button>
      <Tooltip id={uuid} />
    </>
  );
};
