import type { ConfigurationOption } from './constants';
import type { ISentryConfig } from './types';

/**
 * Helper function to load configuration property
 * from the global configuration object
 *
 * @param property
 * @param fallbackValue - optional fallback value
 * @returns string
 */
const _c = (property: ConfigurationOption, fallbackValue?: string): string => {
  return import.meta.env?.[property] || fallbackValue || '';
};

export const getConfigurationOption = _c;

export const isProductionEnvironment = (): boolean => _c('VITE_BRANCH') === 'production';

export const isTestEnvironment = (): boolean => _c('VITE_SITE_VARIANT') === 'test-ci';

export const SENTRY_CONFIG: ISentryConfig = {
  dsn: _c('VITE_SENTRY_DSN'),
  environment: 'production',
  // Caps captured error/message event volume (not performance traces) so the
  // logger -> Sentry bridge in src/logger/index.ts can't spike quota/noise.
  sampleRate: 0.25,
};
