import { Button } from 'theme-ui';

import { Icon } from '../Icon/Icon';

import type { ThemeUIStyleObject } from 'theme-ui';
import type { IGlyphs } from '../Icon/types';

export interface IProps extends React.ButtonHTMLAttributes<HTMLElement> {
  icon: keyof IGlyphs;
  sx?: ThemeUIStyleObject | undefined;
}

export const ButtonIcon = (props: IProps) => {
  return (
    <Button {...props} sx={{ background: 'white', borderRadius: 99, padding: 1, ...props.sx }}>
      <Icon glyph={props.icon} size={18} />
    </Button>
  );
};
