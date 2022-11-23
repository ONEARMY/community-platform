process.env.FUNCTIONS_EMULATOR = 'true'
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:4005'
// https://github.com/firebase/firebase-admin-node/issues/116
process.env.FIREBASE_DATABASE_EMULATOR_HOST = 'http://127.0.0.1:4006'
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:4003'
