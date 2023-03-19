/*************************************************************************************** 
Switch config dependent on use case

For our use case the production config is stored in environment variables passed from
CI. You can replace this with your own config or use the same pattern to keep
api keys secret. Note, create-react-app only passes environment variables prefixed with
'REACT_APP'. The required info has been encrypted and stored in a circleCI deployment context.

Dev config is hardcoded - You can find more information about potential security risk here:
https://javebratt.com/hide-firebase-api/
*****************************************************************************************/

import type { IFirebaseConfig, ISentryConfig, siteVariants } from './types'
import type { ConfigurationOption } from './constants'
import type { UserRole } from '../models'

/**
 * Helper function to load configuration property
 * from the global configuration object
 * During the development cycle this will be process.env
 * when running this application with the output of `yarn build`
 * we will instead load from the global window
 *
 * @param property
 * @param fallbackValue - optional fallback value
 * @returns string
 */
const _c = (property: ConfigurationOption, fallbackValue?: string): string => {
  const configurationSource = ['development', 'test'].includes(
    process.env.NODE_ENV,
  )
    ? process.env
    : window?.__OA_COMMUNITY_PLATFORM_CONFIGURATION
  return configurationSource?.[property] || fallbackValue
}

export const getConfigurationOption = _c

/*********************************************************************************************** /
                                        Site Variants
/********************************************************************************************** */

// On dev sites user can override default role
const devSiteRole: UserRole = localStorage.getItem('devSiteRole') as UserRole

const getSiteVariant = (): siteVariants => {
  const devSiteVariant: siteVariants = localStorage.getItem(
    'devSiteVariant',
  ) as any

  if (devSiteVariant === 'preview') {
    return 'preview'
  }
  if (devSiteVariant === 'emulated_site') {
    return 'emulated_site'
  }
  if (devSiteVariant === 'dev_site') {
    return 'dev_site'
  }
  if (location.host === 'localhost:4000') {
    return 'emulated_site'
  }
  if (
    location.host === 'localhost:3456' ||
    _c('REACT_APP_SITE_VARIANT') === 'test-ci'
  ) {
    return 'test-ci'
  }
  if (_c('REACT_APP_SITE_VARIANT') === 'preview') {
    return 'preview'
  }
  switch (_c('REACT_APP_BRANCH')) {
    case 'production':
      return 'production'
    case 'master':
      return 'staging'
    default:
      return 'dev_site'
  }
}

const siteVariant = getSiteVariant()

/*********************************************************************************************** /
                                        Production
/********************************************************************************************** */

const firebaseConfigs: { [variant in siteVariants]: IFirebaseConfig } = {
  /** Sandboxed dev site, all features available for interaction */
  dev_site: {
    apiKey: 'AIzaSyChVNSMiYxCkbGd9C95aChr9GxRJtW6NRA',
    authDomain: 'precious-plastics-v4-dev.firebaseapp.com',
    databaseURL: 'https://precious-plastics-v4-dev.firebaseio.com',
    messagingSenderId: '174193431763',
    projectId: 'precious-plastics-v4-dev',
    storageBucket: 'precious-plastics-v4-dev.appspot.com',
  },
  /** Sandboxed dev site, populated with copy of live site data (reset weekly) */
  preview: {
    apiKey: 'AIzaSyAWLB1xm3KaLKJhZygu4v247a9YT3dxMAs',
    authDomain: 'onearmy-next.firebaseapp.com',
    databaseURL: 'https://onearmy-next-default-rtdb.firebaseio.com',
    projectId: 'onearmy-next',
    storageBucket: 'onearmy-next.appspot.com',
    messagingSenderId: '1063830272538',
    appId: '1:1063830272538:web:f52f88c613babd6278efa3',
  },
  /** Empty site, populated and torn down during ci ops */
  'test-ci': {
    apiKey: 'AIzaSyDAxS_7M780mI3_tlwnAvpbaqRsQPlmp64',
    authDomain: 'onearmy-test-ci.firebaseapp.com',
    databaseURL: 'https://onearmy-test-ci.firebaseio.com',
    projectId: 'onearmy-test-ci',
    storageBucket: 'onearmy-test-ci.appspot.com',
    messagingSenderId: '174193431763',
  },
  /** Site backed by sandboxed emulator */
  emulated_site: {
    apiKey: 'abc',
    projectId: 'community-platform-emulated',
    storageBucket: 'default-bucket',
  } as any,
  /** Production/live backend with master branch frontend */
  staging: {
    apiKey: 'AIzaSyChVNSMiYxCkbGd9C95aChr9GxRJtW6NRA',
    authDomain: 'precious-plastics-v4-dev.firebaseapp.com',
    databaseURL: 'https://precious-plastics-v4-dev.firebaseio.com',
    messagingSenderId: '174193431763',
    projectId: 'precious-plastics-v4-dev',
    storageBucket: 'precious-plastics-v4-dev.appspot.com',
  },
  /** Production/live backend with released frontend */
  production: {
    apiKey: _c('REACT_APP_FIREBASE_API_KEY'),
    authDomain: _c('REACT_APP_FIREBASE_AUTH_DOMAIN'),
    databaseURL: _c('REACT_APP_FIREBASE_DATABASE_URL'),
    messagingSenderId: _c('REACT_APP_FIREBASE_MESSAGING_SENDER_ID'),
    projectId: _c('REACT_APP_FIREBASE_PROJECT_ID'),
    storageBucket: _c('REACT_APP_FIREBASE_STORAGE_BUCKET'),
  },
}
/*********************************************************************************************** /
                                        Exports
/********************************************************************************************** */

export const SITE = siteVariant
export const DEV_SITE_ROLE = devSiteRole
export const FIREBASE_CONFIG = firebaseConfigs[siteVariant]
export const SENTRY_CONFIG: ISentryConfig = {
  dsn: _c(
    'REACT_APP_SENTRY_DSN',
    'https://8c1f7eb4892e48b18956af087bdfa3ac@sentry.io/1399729',
  ),
  environment: siteVariant,
}

export const VERSION = _c('REACT_APP_PROJECT_VERSION', '')
export const GA_TRACKING_ID = _c('REACT_APP_GA_TRACKING_ID')
