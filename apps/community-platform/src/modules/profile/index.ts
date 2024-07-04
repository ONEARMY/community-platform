import { getConfigurationOption } from '../../config/config'
import { SupportedProfileTypesFactory } from './SupportedProfileTypesFactory'

import type { PlatformTheme } from '@onearmy.apps/themes'

export const getSupportedProfileTypes = (currentTheme?: PlatformTheme) => {
  const supportedProfileTypes = SupportedProfileTypesFactory(
    getConfigurationOption('REACT_APP_PLATFORM_PROFILES', ''),
    currentTheme,
  )()

  return supportedProfileTypes
}
