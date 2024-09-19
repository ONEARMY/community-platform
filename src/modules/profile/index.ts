import { getConfigurationOption } from '../../config/config'
import { SupportedProfileTypesFactory } from './SupportedProfileTypesFactory'

export const getSupportedProfileTypes = () => {
  const supportedProfileTypes = SupportedProfileTypesFactory(
    getConfigurationOption('VITE_PLATFORM_PROFILES', ''),
  )()

  return supportedProfileTypes
}
