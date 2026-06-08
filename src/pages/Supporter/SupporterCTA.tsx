import type { ReactNode } from 'react';
import { Box } from 'theme-ui';

export const SupporterCTA = ({
  onClick,
  disabled,
  children,
  color,
  type = 'button',
}: {
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
  color: string;
  type?: 'button' | 'submit';
}) => (
  <Box
    as="button"
    {...({ type, disabled } as any)}
    onClick={onClick}
    sx={{
      width: '100%',
      height: '64px',
      borderRadius: '5px',
      border: 'none',
      bg: color,
      color: 'black',
      fontSize: '22px',
      fontWeight: 500,
      fontFamily: 'inherit',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      transition: 'background-color 0.15s, color 0.15s',
      '&:hover:not(:disabled)': {
        bg: 'black',
        color: 'white',
      },
      '&:focus-visible': {
        outline: '2px solid black',
        outlineOffset: '2px',
      },
    }}
  >
    {children}
  </Box>
);
