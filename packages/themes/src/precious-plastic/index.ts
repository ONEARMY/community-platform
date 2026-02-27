import { baseTheme } from '../common';
import { getButtons } from '../common/button';

import type { PlatformTheme } from '../types';

export type { ButtonVariants } from '../common/button';

const colors = {
  ...baseTheme.colors,
  primary: '#fee77b',
  accent: { base: '#fee77b', hover: '#ffde45' },
};

export const Theme: PlatformTheme = {
  ...baseTheme,
  buttons: getButtons(colors),
  colors,
};
