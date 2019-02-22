/*************************************************************************************** 
Switch config dependent on use case

For our use case the production config is stored in environment variables passed from
Travis-CI. You can replace this with your own config or use the same pattern to keep
api keys secret. Note, create-react-app only passes environment variables prefixed with
'REACT_APP'. The required info has been encrypted and stored in travis. 

Dev config is hardcoded - You can find more information about potential security risk here:
https://javebratt.com/hide-firebase-api/
*****************************************************************************************/

/*********************************************************************************************** /
                                        Dev/Staging
/********************************************************************************************** */
let firebaseConfig: IFirebaseConfig = {
  apiKey: 'AIzaSyChVNSMiYxCkbGd9C95aChr9GxRJtW6NRA',
  authDomain: 'precious-plastics-v4-dev.firebaseapp.com',
  databaseURL: 'https://precious-plastics-v4-dev.firebaseio.com',
  messagingSenderId: '174193431763',
  projectId: 'precious-plastics-v4-dev',
  storageBucket: 'precious-plastics-v4-dev.appspot.com',
}
let analyticsConfig: IAnalyticsConfig = {
  trackingCode: 'UA-133973230-2',
  viewId: '189456245',
}
let sentryConfig: ISentryConfig = {
  dsn: 'https://8c1f7eb4892e48b18956af087bdfa3ac@sentry.io/1399729',
}
let algoliaConfig: IAlgoliaConfig = {
  adminAPIKey: '271f0ad7a58b72cad2ca625497ce6f99',
  searchOnlyAPIKey: 'af213b7fb41ac5cbc6a2e10164370779',
  monitoringAPIKey: 'b38f41ddf7203342a6daffdb17de99a9',
  applicationID: '4RM0GZKTOC',
}

/*********************************************************************************************** /
                                        Site Variants
/********************************************************************************************** */

// different production site config pulled from environment variable
const productionSites = [
  'onearmy.world',
  'onearmyworld.firebaseapp.com',
  'documentation.preciousplastic.com',
]
// as both dev.onearmy.world and onearmy.world are production builds we can't use process.env to distinguish
// will be set to one of 'localhost', 'staging' or 'production'
let siteVariant: siteVariants =
  process.env.NODE_ENV === 'development' ? 'localhost' : 'staging'

/*********************************************************************************************** /
                                        Production
/********************************************************************************************** */

// production config is passed as environment variables during CI build.
// most config requires json objects, so these are encoded as base64 strings to make for easier storing
if (productionSites.indexOf(window.location.host) > -1) {
  siteVariant = 'production'
  const e = process.env
  // note, technically not required as supplied directly to firebase config() method during build
  firebaseConfig = b64StrToJson(
    e.REACT_APP_FIREBASE_CONFIG as string,
  ) as IFirebaseConfig
  analyticsConfig = b64StrToJson(
    e.REACT_APP_ANALYTICS_CONFIG_PROD as string,
  ) as IAnalyticsConfig
  sentryConfig = {
    dsn: e.REACT_APP_SENTRY_DSN as string,
  }
  algoliaConfig = b64StrToJson(
    // *** NOTE - Needs to be created
    e.REACT_APP_ALGOLIA_CONFIG as string,
  ) as IAlgoliaConfig
}

/*********************************************************************************************** /
                                        Exports
/********************************************************************************************** */

export const SITE = siteVariant
export const FIREBASE_CONFIG = firebaseConfig
export const GOOGLE_ANALYTICS_CONFIG = analyticsConfig
export const ALGOLIA_CONFIG = algoliaConfig
export const SENTRY_CONFIG = sentryConfig

/*********************************************************************************************** /
                                        Utils
/********************************************************************************************** */

function b64StrToJson(str: string) {
  return JSON.parse(atob(str))
}

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
}
interface IAnalyticsConfig {
  trackingCode: string
  viewId: string
}
interface ISentryConfig {
  dsn: string
}
interface IAlgoliaConfig {
  adminAPIKey: string
  searchOnlyAPIKey: string
  monitoringAPIKey: string
  applicationID: string
}
type siteVariants = 'localhost' | 'staging' | 'production'
