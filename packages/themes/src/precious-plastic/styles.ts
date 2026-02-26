import { baseTheme } from '../common';
import { getButtons } from '../common/button';

import type { ThemeWithName } from '../types';

export type { ButtonVariants } from '../common/button';

const colors = {
  ...baseTheme.colors,
  primary: '#fee77b',
  accent: { base: '#fee77b', hover: '#ffde45' },
};

export const styles: ThemeWithName = {
  ...baseTheme,
  buttons: getButtons(colors),
  colors,
};
