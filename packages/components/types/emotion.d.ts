import '@emotion/react';

import type { PlatformTheme } from 'oa-themes';

declare module '@emotion/react' {
  export interface Theme extends PlatformTheme {}
}
