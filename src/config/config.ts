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
let sentryConfig: ISentryConfig = {
  dsn: 'https://8c1f7eb4892e48b18956af087bdfa3ac@sentry.io/1399729',
}
// note - algolia lets you have multiple apps which can serve different purposes
// (and all have their own free quotas)
let algoliaSearchConfig: IAlgoliaConfig = {
  searchOnlyAPIKey: 'af213b7fb41ac5cbc6a2e10164370779',
  monitoringAPIKey: 'b38f41ddf7203342a6daffdb17de99a9',
  applicationID: '4RM0GZKTOC',
}
let algoliaPlacesConfig: IAlgoliaConfig = {
  searchOnlyAPIKey: 'bd622e6c60cc48e571e47b9f6ff63489',
  monitoringAPIKey: '22c721903a87aa68cb4f8b337d83706d',
  applicationID: 'plG9OH6JI4BR',
}
/*********************************************************************************************** /
                                        Site Variants
/********************************************************************************************** */
const e = process.env
// the name of the github branch is passed via travis as an environment variable
const branch = e.REACT_APP_BRANCH as string
// as both dev.onearmy.world and onearmy.world are production builds we can't use process.env to distinguish
// will be set to one of 'localhost', 'staging' or 'production'
const siteVariant: siteVariants =
  branch === 'production'
    ? 'production'
    : branch === 'master'
    ? 'staging'
    : 'localhost'
/*********************************************************************************************** /
                                        Production
/********************************************************************************************** */

// production config is passed as environment variables during CI build.
if (siteVariant === 'production') {
  // note, technically not required as supplied directly to firebase config() method during build
  firebaseConfig = {
    apiKey: e.REACT_APP_FIREBASE_API_KEY as string,
    authDomain: e.REACT_APP_FIREBASE_AUTH_DOMAIN as string,
    databaseURL: e.REACT_APP_FIREBASE_DATABASE_URL as string,
    messagingSenderId: e.REACT_APP_FIREBASE_MESSAGING_SENDER_ID as string,
    projectId: e.REACT_APP_FIREBASE_PROJECT_ID as string,
    storageBucket: e.REACT_APP_FIREBASE_STORAGE_BUCKET as string,
  }
  sentryConfig = {
    dsn: e.REACT_APP_SENTRY_DSN as string,
  }
  // TODO - create production algolia config
  algoliaSearchConfig = {
    applicationID: '',
    monitoringAPIKey: '',
    searchOnlyAPIKey: '',
  }
  algoliaPlacesConfig = {
    applicationID: '',
    monitoringAPIKey: '',
    searchOnlyAPIKey: '',
  }
  // disable console logs
  // tslint:disable no-empty
  console.log = () => {}
}

/*********************************************************************************************** /
                                        Exports
/********************************************************************************************** */

export const SITE = siteVariant
export const FIREBASE_CONFIG = firebaseConfig
export const ALGOLIA_SEARCH_CONFIG = algoliaSearchConfig
export const ALGOLIA_PLACES_CONFIG = algoliaPlacesConfig
export const SENTRY_CONFIG = sentryConfig
// tslint:disable no-var-requires
export const VERSION = require('../../package.json').version

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
interface ISentryConfig {
  dsn: string
}
interface IAlgoliaConfig {
  searchOnlyAPIKey: string
  monitoringAPIKey: string
  applicationID: string
}
type siteVariants = 'localhost' | 'staging' | 'production'
