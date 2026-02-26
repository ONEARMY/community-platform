import { baseTheme } from '../common';
import { getButtons } from '../common/button';

import type { ThemeWithName } from '../types';

export type { ButtonVariants } from '../common/button';

const colors = {
  ...baseTheme.colors,
  primary: '#8ab57f',
  accent: { base: '#8ab57f', hover: 'hsl(108, 25%, 68%)' },
};

export const StyledComponentTheme: ThemeWithName = {
  ...baseTheme,
  colors,
  buttons: getButtons(colors),
};
