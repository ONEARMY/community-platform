/* 
For our use case the production config is stored in environment variables passed from
Travis-CI. You can replace this with your own config or use the same pattern to keep
api keys secret. Note, create-react-app only passes environment variables prefixed with
'REACT_APP'
*/

const config = process.env.REACT_APP_FIREBASE_PROD_CONFIG as string;
export const FirebaseProdConfig = JSON.parse(config);

/* Alt, could just define in same way as config.dev.ts */

// export const FirebaseProdConfig = {
//   apiKey: "AIzaSyChVNSMiYxCkbGd9C95aChr9GxRJtW6NRA",
//   authDomain: "precious-plastics-v4-dev.firebaseapp.com",
//   databaseURL: "https://precious-plastics-v4-dev.firebaseio.com",
//   messagingSenderId: "174193431763",
//   projectId: "precious-plastics-v4-dev",
//   storageBucket: "precious-plastics-v4-dev.appspot.com"
// }

/*
To create a config in travis you can
$ travis encrypt REACT_APP_FIREBASE_PROD_CONFIG = '{...}' --add env
*/
