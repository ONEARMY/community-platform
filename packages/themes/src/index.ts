import { baseTheme } from './common';
import { buttons } from './common/button';
import { commonStyles } from './common/commonStyles';

import type { PlatformTheme } from './types';

// Export single theme that uses CSS variables for dynamic theming
export const theme: PlatformTheme = {
  ...baseTheme,
  buttons,
};

// Keep commonStyles export for backward compatibility
export { commonStyles };

export type { ButtonVariants } from './common/button';
export { GlobalFonts } from './fonts';

export type { PlatformTheme } from './types';
