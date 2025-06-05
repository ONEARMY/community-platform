import { SupportedProfileTypesFactory } from './SupportedProfileTypesFactory'

// This should be set in .env
const DEFAULT_PROFILE_TYPES = 'member,space'

export const getSupportedProfileTypes = () => {
  const supportedProfileTypes = SupportedProfileTypesFactory(
    import.meta.env.VITE_PLATFORM_PROFILES || DEFAULT_PROFILE_TYPES,
  )()

  return supportedProfileTypes
}
