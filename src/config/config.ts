// switch firebase config depending on dev or production environment
let config
const env = process.env.NODE_ENV
const devConfig = {
  apiKey: 'AIzaSyChVNSMiYxCkbGd9C95aChr9GxRJtW6NRA',
  authDomain: 'precious-plastics-v4-dev.firebaseapp.com',
  databaseURL: 'https://precious-plastics-v4-dev.firebaseio.com',
  messagingSenderId: '174193431763',
  projectId: 'precious-plastics-v4-dev',
  storageBucket: 'precious-plastics-v4-dev.appspot.com',
}
console.log(`environment: ${process.env.NODE_ENV}`)

/*************************************************************************************** 
For our use case the production config is stored in environment variables passed from
Travis-CI. You can replace this with your own config or use the same pattern to keep
api keys secret. Note, create-react-app only passes environment variables prefixed with
'REACT_APP'. The required info has been encrypted and stored in travis.

Additionally we have 2 repository branches deployed (dev and master), with configs
that are identified through an additional environment variable defined in .travis.yml

Dev config is hardcoded - it is recommended if changing for production to hide the 
details via gitignore. You can find more information about potential security risk here:
https://javebratt.com/hide-firebase-api/
*****************************************************************************************/

if (env === 'production') {
  console.log('production environment', process.env)
  const branch = process.env.REACT_APP_BRANCH
  console.log('branch', branch)
  try {
    config = JSON.parse(process.env[
      `REACT_APP_FIREBASE_${branch}_CONFIG`
    ] as string)
  } catch (error) {
    console.error(
      'could not load production firebase config, reverting to development',
    )
    config = devConfig
  }
} else {
  config = devConfig
}
export const FIREBASE_CONFIG = config
