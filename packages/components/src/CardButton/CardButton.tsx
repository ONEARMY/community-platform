import type { BoxProps, ThemeUIStyleObject } from 'theme-ui';
import { Card } from 'theme-ui';

export interface IProps extends BoxProps {
  children: React.ReactNode;
  extrastyles?: ThemeUIStyleObject | undefined;
  isSelected?: boolean;
}

// When an onClick is passed the card is genuinely interactive, so it has to be
// rendered as a real <button>. A <div> is not focusable, gets skipped by tab
// navigation and is not announced as a control to assistive technology.
const buttonReset: ThemeUIStyleObject = {
  appearance: 'none',
  color: 'inherit',
  font: 'inherit',
  textAlign: 'inherit',
  // Card already provides the border via its variant.
  border: 0,
};

export const CardButton = (props: IProps) => {
  const { children, extrastyles, isSelected, ...cardProps } = props;
  const isInteractive = !!props.onClick;

  return (
    <Card
      {...(isInteractive ? { as: 'button', type: 'button', 'aria-pressed': !!isSelected } : {})}
      {...cardProps}
      sx={{
        alignItems: 'center',
        alignContent: 'center',
        display: 'flex',
        gap: 2,
        marginTop: '4px',
        borderRadius: 2,
        padding: 0,
        transition: 'borderBottom 0.2s, transform 0.2s',
        '&:hover': !isSelected && {
          animationSpeed: '0.3s',
          cursor: 'pointer',
          marginTop: '4px',
          borderBottom: '2px solid',
          transform: 'translateY(-2px)',
          borderColor: 'black',
        },
        '&:active': {
          transform: 'translateY(1px)',
          marginTop: '3px',
          borderBottom: '3px solid',
          borderColor: 'grey',
          transition: 'borderBottom 0.2s, transform 0.2s, borderColor 0.2s',
        },
        ...(isSelected
          ? {
              marginTop: '2px',
              borderBottom: '4px solid',
              borderColor: 'grey',
              transform: 'translateY(-2px)',
            }
          : {}),
        ...(isInteractive ? buttonReset : {}),
        ...extrastyles,
      }}
    >
      {children}
    </Card>
  );
};
