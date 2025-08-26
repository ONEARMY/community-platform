import logo from '../../assets/images/themes/fixing-fashion/fixing-fashion-header.png'
import { baseTheme } from '../common'
import { getButtons } from '../common/button'

import type { ThemeWithName } from '../types'

export type { ButtonVariants } from '../common/button'

export const colors = {
  ...baseTheme.colors,
  primary: 'green',
  accent: { base: '#F82F03', hover: 'hsl(14, 81%, 63%)' },
}

export const alerts = {
  ...baseTheme.alerts,
  accent: {
    ...baseTheme.alerts.failure,
    backgroundColor: colors.accent.base,
    color: colors.black,
  },
}

export const StyledComponentTheme: ThemeWithName = {
  name: 'Fixing Fashion',
  logo: logo,
  ...baseTheme,
  alerts,
  colors,
  buttons: getButtons(colors),
}
