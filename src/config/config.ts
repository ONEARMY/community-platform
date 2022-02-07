/*************************************************************************************** 
Switch config dependent on use case

For our use case the production config is stored in environment variables passed from
CI. You can replace this with your own config or use the same pattern to keep
api keys secret. Note, create-react-app only passes environment variables prefixed with
'REACT_APP'. The required info has been encrypted and stored in a circleCI deployment context.

Dev config is hardcoded - You can find more information about potential security risk here:
https://javebratt.com/hide-firebase-api/
*****************************************************************************************/

import { UserRole } from 'src/models'

/*********************************************************************************************** /
                                        Dev/Staging
/********************************************************************************************** */

let sentryConfig: ISentryConfig = {
  dsn: 'https://8c1f7eb4892e48b18956af087bdfa3ac@sentry.io/1399729',
}
// note - algolia lets you have multiple apps which can serve different purposes
// (and all have their own free quotas)
let algoliaSearchConfig: IAlgoliaConfig = {
  searchOnlyAPIKey: 'af213b7fb41ac5cbc6a2e10164370779',
  applicationID: '4RM0GZKTOC',
}
let algoliaPlacesConfig: IAlgoliaConfig = {
  searchOnlyAPIKey: 'bd622e6c60cc48e571e47b9f6ff63489',
  applicationID: 'plG9OH6JI4BR',
}
/*********************************************************************************************** /
                                        Site Variants
/********************************************************************************************** */
const e = process.env
// the name of the github branch is passed via ci as an environment variable
const branch = e.REACT_APP_BRANCH as string
// as both dev.onearmy.world and onearmy.world are production builds we can't use process.env to distinguish
// will be set to one of 'localhost', 'staging' or 'production'

// On dev sites user can override default role
const devSiteRole: UserRole = localStorage.getItem('devSiteRole') as UserRole

function getSiteVariant(
  gitBranch: string,
  env: typeof process.env,
): siteVariants {
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
  if (env.REACT_APP_SITE_VARIANT === 'test-ci') {
    return 'test-ci'
  }
  if (env.REACT_APP_SITE_VARIANT === 'preview') {
    return 'preview'
  }
  switch (gitBranch) {
    case 'production':
      return 'production'
    case 'master':
      return 'staging'
    default:
      return 'dev_site'
  }
}

const siteVariant = getSiteVariant(branch, e)
console.log(`[${siteVariant}] site`)

/*********************************************************************************************** /
                                        Production
/********************************************************************************************** */

// production config is passed as environment variables during CI build.
if (siteVariant === 'production') {
  // note, technically not required as supplied directly to firebase config() method during build
  sentryConfig = {
    dsn: e.REACT_APP_SENTRY_DSN as string,
  }
  // TODO - create production algolia config
  algoliaSearchConfig = {
    applicationID: '',
    searchOnlyAPIKey: '',
  }
  algoliaPlacesConfig = {
    applicationID: e.REACT_APP_ALGOLIA_PLACES_APP_ID as string,
    searchOnlyAPIKey: e.REACT_APP_ALGOLIA_PLACES_API_KEY as string,
  }
  // disable console logs
  // eslint-disable-next-line
  console.log = () => {}
}

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
  /** Same default endpoint as test-ci, but most functions will be overwritten by emulators */
  emulated_site: {
    apiKey: 'AIzaSyDAxS_7M780mI3_tlwnAvpbaqRsQPlmp64',
    projectId: 'onearmy-test-ci',
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
    apiKey: e.REACT_APP_FIREBASE_API_KEY as string,
    authDomain: e.REACT_APP_FIREBASE_AUTH_DOMAIN as string,
    databaseURL: e.REACT_APP_FIREBASE_DATABASE_URL as string,
    messagingSenderId: e.REACT_APP_FIREBASE_MESSAGING_SENDER_ID as string,
    projectId: e.REACT_APP_FIREBASE_PROJECT_ID as string,
    storageBucket: e.REACT_APP_FIREBASE_STORAGE_BUCKET as string,
  },
}
/*********************************************************************************************** /
                                        Exports
/********************************************************************************************** */

export const SITE = siteVariant
export const DEV_SITE_ROLE = devSiteRole
export const FIREBASE_CONFIG = firebaseConfigs[siteVariant]
export const ALGOLIA_SEARCH_CONFIG = algoliaSearchConfig
export const ALGOLIA_PLACES_CONFIG = algoliaPlacesConfig
export const SENTRY_CONFIG = sentryConfig
export const VERSION = require('../../package.json').version
export const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID

/*********************************************************************************************** /
                                        Interfaces
/********************************************************************************************** */
interface IFirebaseConfig {
  apiKey: string
  authDomain: string
  databaseURL: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId?: string
}
interface ISentryConfig {
  dsn: string
}
interface IAlgoliaConfig {
  searchOnlyAPIKey: string
  applicationID: string
}
type siteVariants =
  | 'emulated_site'
  | 'dev_site'
  | 'test-ci'
  | 'staging'
  | 'production'
  | 'preview'
