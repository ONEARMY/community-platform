import type { ThemeUIStyleObject } from 'theme-ui';
import { Alert } from 'theme-ui';

// Types of alert currently specified in the theme
type AlertVariants = 'accent' | 'failure' | 'info' | 'success';

export interface IProps {
  children: React.ReactNode;
  onClick?: () => void;
  sx?: ThemeUIStyleObject | undefined;
  variant?: AlertVariants;
}

export const Banner = (props: IProps) => {
  const { children, onClick, sx, variant } = props;

  return (
    <Alert
      data-cy="Banner"
      onClick={onClick}
      variant={variant || 'failure'}
      sx={{
        borderRadius: 2,
        alignItems: 'center',
        flex: '1',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        fontSize: 2,
        ':hover': { textDecoration: onClick ? 'underline' : 'none' },
        ...sx,
      }}
    >
      {children}
    </Alert>
  );
};
