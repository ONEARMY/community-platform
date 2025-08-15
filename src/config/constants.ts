/**
 * This export is intended for use _only_ within the
 * build process. If you're looking to work with
 * the configuration options please use the `ConfigurationOption`
 * type exported from this file
 */
export const _supportedConfigurationOptions = [
  'VITE_SENTRY_DSN',
  'VITE_PROJECT_VERSION',
  'VITE_GA_TRACKING_ID',
  'VITE_BRANCH',
  'VITE_THEME',
  'VITE_SITE_VARIANT',
  'VITE_THEME',
  'VITE_LOG_LEVEL',
  'VITE_LOG_TRANSPORT',
  'VITE_SUPPORTED_MODULES',
  'VITE_PLATFORM_PROFILES',
  'VITE_CDN_URL',
  'VITE_PATREON_CLIENT_ID',
  'VITE_API_URL',
  'VITE_SITE_NAME',
  'VITE_NO_MESSAGING',
] as const

export type ConfigurationOption =
  (typeof _supportedConfigurationOptions)[number]
