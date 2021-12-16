/**
 * This export is intended for use _only_ within the 
 * build process. If you're looking to work with 
 * the configuration options please use the `ConfigurationOption`
 * type exported from this file
 */
export const _supportedConfigurationOptions = [
  'REACT_APP_SENTRY_DSN',
  'REACT_APP_PROJECT_VERSION',
  'REACT_APP_GA_TRACKING_ID',
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_DATABASE_URL',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_ALGOLIA_PLACES_APP_ID',
  'REACT_APP_ALGOLIA_PLACES_API_KEY',
  'REACT_APP_BRANCH',
  'REACT_APP_SITE_VARIANT',
  'REACT_APP_LOG_LEVEL',
  'REACT_APP_SUPPORTED_MODULES',
  'REACT_APP_PLATFORM_THEME',
] as const;

export type ConfigurationOption = typeof _supportedConfigurationOptions[number]