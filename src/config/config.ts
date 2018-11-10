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
let config
const devConfig = {
  apiKey: 'AIzaSyChVNSMiYxCkbGd9C95aChr9GxRJtW6NRA',
  authDomain: 'precious-plastics-v4-dev.firebaseapp.com',
  databaseURL: 'https://precious-plastics-v4-dev.firebaseio.com',
  messagingSenderId: '174193431763',
  projectId: 'precious-plastics-v4-dev',
  storageBucket: 'precious-plastics-v4-dev.appspot.com',
}

// different production site config pulled from environment variable
const productionSites = [
  'onearmy.world',
  'onearmyworld.firebaseapp.com',
  'documentation.preciousplastic.com',
]
if (productionSites.indexOf(window.location.host) > -1) {
  const e = process.env
  config = {
    apiKey: e.REACT_APP_FIREBASE_API_KEY,
    authDomain: e.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: e.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: e.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: e.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: e.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  }
} else {
  config = devConfig
}
export const FIREBASE_CONFIG = config
