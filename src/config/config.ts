/*************************************************************************************** 
Switch config dependent on use case

For our use case the production config is stored in environment variables passed from
Travis-CI. You can replace this with your own config or use the same pattern to keep
api keys secret. Note, create-react-app only passes environment variables prefixed with
'REACT_APP'. The required info has been encrypted and stored in travis. 

Dev config is hardcoded - it is recommended if changing for production to hide the 
details via gitignore. You can find more information about potential security risk here:
https://javebratt.com/hide-firebase-api/
*****************************************************************************************/

let firebaseConfig = {
  apiKey: 'AIzaSyChVNSMiYxCkbGd9C95aChr9GxRJtW6NRA',
  authDomain: 'precious-plastics-v4-dev.firebaseapp.com',
  databaseURL: 'https://precious-plastics-v4-dev.firebaseio.com',
  messagingSenderId: '174193431763',
  projectId: 'precious-plastics-v4-dev',
  storageBucket: 'precious-plastics-v4-dev.appspot.com',
}
let analyticsConfig = {
  trackingCode: 'UA-133973230-2',
  viewId: '189456245',
}
let sentryConfig = {
  dsn: 'https://8c1f7eb4892e48b18956af087bdfa3ac@sentry.io/1399729',
}

// different production site config pulled from environment variable
const productionSites = [
  'onearmy.world',
  'onearmyworld.firebaseapp.com',
  'documentation.preciousplastic.com',
]
// as both dev.onearmy.world and onearmy.world are production builds
// we can't use process.env to distinguish, so making explicit here
// (in future may wish to rename 'dev' site to 'staging')
type siteVariants = 'localhost' | 'staging' | 'production'
let siteVariant: siteVariants =
  process.env.NODE_ENV === 'development' ? 'localhost' : 'staging'

if (productionSites.indexOf(window.location.host) > -1) {
  siteVariant = 'production'
  const e = process.env
  firebaseConfig = {
    apiKey: e.REACT_APP_FIREBASE_API_KEY as string,
    authDomain: e.REACT_APP_FIREBASE_AUTH_DOMAIN as string,
    databaseURL: e.REACT_APP_FIREBASE_DATABASE_URL as string,
    projectId: e.REACT_APP_FIREBASE_PROJECT_ID as string,
    storageBucket: e.REACT_APP_FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: e.REACT_APP_FIREBASE_MESSAGING_SENDER_ID as string,
  }
  analyticsConfig = {
    trackingCode: e.REACT_APP_GA_TRACKING_CODE as string,
    viewId: e.REACT_APP_GA_VIEW_ID as string,
  }
  sentryConfig = {
    dsn: e.REACT_APP_SENTRY_DSN as string,
  }
}
export const SITE = siteVariant
export const FIREBASE_CONFIG = firebaseConfig
export const GOOGLE_ANALYTICS_CONFIG = analyticsConfig
export const SENTRY_CONFIG = sentryConfig
