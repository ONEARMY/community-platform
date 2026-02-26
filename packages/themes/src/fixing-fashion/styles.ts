import { baseTheme } from '../common';
import { getButtons } from '../common/button';

import type { ThemeWithName } from '../types';

export type { ButtonVariants } from '../common/button';

const colors = {
  ...baseTheme.colors,
  primary: '#f82f03',
  accent: { base: '#f82f03', hover: 'hsl(14, 81%, 63%)' },
};

export const StyledComponentTheme: ThemeWithName = {
  ...baseTheme,
  colors,
  buttons: getButtons(colors),
};
