/*************************************************************************************** 
Switch config dependent on use case

For our use case the production config is stored in environment variables passed from
CI. You can replace this with your own config or use the same pattern to keep
api keys secret. Note, create-react-app only passes environment variables prefixed with
'REACT_APP'. The required info has been encrypted and stored in a circleCI deployment context.

*****************************************************************************************/

import type { ConfigurationOption } from './constants';
import type { ISentryConfig, siteVariants } from './types';

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

const getFromLocalStorageFirst = (property: ConfigurationOption): string => {
  return typeof localStorage !== 'undefined' && localStorage[property] ? (localStorage.getItem(property) as string) : _c(property, '');
};

export const getConfigurationOption = _c;

/*********************************************************************************************** /
                                        Site Variants
/********************************************************************************************** */

// On dev sites user can override default role

const getSiteVariant = (): siteVariants => {
  if ((typeof location !== 'undefined' && location.host === 'localhost:3456') || _c('VITE_SITE_VARIANT') === 'test-ci') {
    return 'test-ci';
  }
  if (_c('VITE_SITE_VARIANT') === 'preview') {
    return 'preview';
  }
  switch (_c('VITE_BRANCH')) {
    case 'production':
      return 'production';
    case 'master':
      return 'staging';
    default:
      return 'dev_site';
  }
};

const siteVariant = getSiteVariant();

export const isProductionEnvironment = (): boolean => {
  const site = getSiteVariant();
  return site === 'production';
};

export const SITE = siteVariant;
export const SENTRY_CONFIG: ISentryConfig = {
  dsn: _c('VITE_SENTRY_DSN', 'https://8c1f7eb4892e48b18956af087bdfa3ac@sentry.io/1399729'),
  environment: siteVariant,
};

export const GA_TRACKING_ID = _c('VITE_GA_TRACKING_ID');
export const PATREON_CLIENT_ID = _c('VITE_PATREON_CLIENT_ID');

export const VITE_THEME = getFromLocalStorageFirst('VITE_THEME');

export const isPreciousPlastic = (): boolean => {
  return getFromLocalStorageFirst('VITE_THEME') === 'precious-plastic';
};

export const MAP_PROFILE_TYPE_HIDDEN_BY_DEFAULT = isPreciousPlastic() ? 'member' : undefined;

export const NO_MESSAGING = getFromLocalStorageFirst('VITE_NO_MESSAGING');
