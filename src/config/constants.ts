/**
 * This export is intended for use _only_ within the
 * build process. If you're looking to work with
 * the configuration options please use the `ConfigurationOption`
 * type exported from this file
 */
export const _supportedConfigurationOptions = [
  'VITE_APP_SENTRY_DSN',
  'VITE_APP_PROJECT_VERSION',
  'VITE_APP_GA_TRACKING_ID',
  'VITE_APP_FIREBASE_API_KEY',
  'VITE_APP_FIREBASE_AUTH_DOMAIN',
  'VITE_APP_FIREBASE_DATABASE_URL',
  'VITE_APP_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_APP_FIREBASE_PROJECT_ID',
  'VITE_APP_FIREBASE_STORAGE_BUCKET',
  'VITE_APP_ALGOLIA_PLACES_APP_ID',
  'VITE_APP_ALGOLIA_PLACES_API_KEY',
  'VITE_APP_BRANCH',
  'VITE_APP_SITE_VARIANT',
  'VITE_APP_LOG_LEVEL',
  'VITE_APP_LOG_TRANSPORT',
  'VITE_APP_SUPPORTED_MODULES',
  'VITE_APP_PLATFORM_THEME',
  'VITE_APP_PLATFORM_PROFILES',
  'VITE_APP_CDN_URL',
  'VITE_APP_PATREON_CLIENT_ID',
  'VITE_APP_API_URL',
] as const

export type ConfigurationOption = typeof _supportedConfigurationOptions[number]
