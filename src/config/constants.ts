/**
 * This export is intended for use _only_ within the
 * build process. If you're looking to work with
 * the configuration options please use the `ConfigurationOption`
 * type exported from this file
 */
export const _supportedConfigurationOptions = [
  'VITE_SENTRY_DSN',
  'VITE_BRANCH',
  'VITE_SITE_VARIANT',
] as const;

export type ConfigurationOption = (typeof _supportedConfigurationOptions)[number];
