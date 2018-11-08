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

let config = {
  apiKey: 'AIzaSyChVNSMiYxCkbGd9C95aChr9GxRJtW6NRA',
  authDomain: 'precious-plastics-v4-dev.firebaseapp.com',
  databaseURL: 'https://precious-plastics-v4-dev.firebaseio.com',
  messagingSenderId: '174193431763',
  projectId: 'precious-plastics-v4-dev',
  storageBucket: 'precious-plastics-v4-dev.appspot.com',
}

// different production site config pulled from environment variable
const productionSites = ['onearmy.world', 'onearmyworld.firebaseapp.com']
if (productionSites.indexOf(window.location.host) > -1) {
  try {
    config = JSON.parse(process.env[
      `REACT_APP_FIREBASE_PRODUCTION_CONFIG`
    ] as string)
  } catch (error) {
    console.log('could not pass prod env', process.env)
  }
}
export const FIREBASE_CONFIG = config
