import { useId, useState } from 'react';
import { useNavigate } from 'react-router';
import type { ThemeUIStyleObject } from 'theme-ui';
import { Text, useThemeUI } from 'theme-ui';
import { Button } from '../Button/Button';
import { Tooltip } from '../Tooltip/Tooltip';

export interface IProps {
  hasUserVotedUseful: boolean;
  isLoggedIn: boolean;
  onUsefulClick: () => Promise<void>;
  sx?: ThemeUIStyleObject;
}

export const UsefulStatsButton = (props: IProps) => {
  const { theme } = useThemeUI() as any;
  const navigate = useNavigate();
  const uuid = useId();

  const [disabled, setDisabled] = useState<boolean>();

  const handleUsefulClick = async () => {
    setDisabled(true);
    try {
      await props.onUsefulClick();
    } catch (_) {
      // do nothing
    }
    setDisabled(false);
  };

  return (
    <>
      <Button
        type="button"
        data-tooltip-id={uuid}
        data-tooltip-content={props.isLoggedIn ? '' : 'Login to add your vote'}
        data-cy={props.isLoggedIn ? 'vote-useful' : 'vote-useful-redirect'}
        onClick={() =>
          props.isLoggedIn
            ? handleUsefulClick()
            : navigate('/sign-in?returnUrl=' + encodeURIComponent(location.pathname))
        }
        disabled={disabled}
        sx={{
          fontSize: 2,
          backgroundColor: theme.colors.white,
          py: 0,
          '&:hover': {
            backgroundColor: theme.colors.softblue,
          },
          ...props.sx,
        }}
        icon={'star-active'}
        iconFilter={props.hasUserVotedUseful ? 'unset' : 'grayscale(1)'}
      >
        <Text
          py={2}
          sx={{
            display: 'inline-block',
          }}
        >
          {props.hasUserVotedUseful ? 'Marked as useful' : 'Mark as useful'}
        </Text>
      </Button>
      <Tooltip id={uuid} />
    </>
  );
};
