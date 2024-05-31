import { getConfigurationOption } from '../../config/config'
import { SupportedProfileTypesFactory } from './SupportedProfileTypesFactory'

import type { PlatformTheme } from 'oa-themes'

export const getSupportedProfileTypes = (currentTheme?: PlatformTheme) => {
  const supportedProfileTypes = SupportedProfileTypesFactory(
    getConfigurationOption('VITE_APP_PLATFORM_PROFILES', ''),
    currentTheme,
  )()

  return supportedProfileTypes
}
