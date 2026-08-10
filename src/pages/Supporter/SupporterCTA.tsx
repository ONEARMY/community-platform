import type { ReactNode } from 'react';
import { Box } from 'theme-ui';

export const SupporterCTA = ({
  onClick,
  disabled,
  children,
  color,
  type = 'button',
  dataCy,
}: {
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
  color: string;
  type?: 'button' | 'submit';
  dataCy?: string;
}) => (
  <Box
    as="button"
    {...({ type, disabled, 'data-cy': dataCy } as any)}
    onClick={onClick}
    sx={{
      width: '100%',
      height: ['64px', '64px'],
      borderRadius: '5px',
      border: 'none',
      bg: color,
      color: 'black',
      fontSize: ['17px', '22px'],
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
