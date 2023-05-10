import type { PlatformTheme } from 'oa-themes'
import { SupportedProfileTypesFactory } from './SupportedProfileTypesFactory'
import { getConfigurationOption } from '../../config/config'

export const getSupportedProfileTypes = (currentTheme?: PlatformTheme) => {
  const supportedProfileTypes = SupportedProfileTypesFactory(
    getConfigurationOption('REACT_APP_PLATFORM_PROFILES', ''),
    currentTheme,
  )()

  return supportedProfileTypes
}
