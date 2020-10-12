import * as functions from 'firebase-functions'

// Models can be imported from the main package for use here
// NOTE 1 - this requires adjustment main src in package.json
// NOTE 2 - shorthand @OAModels notation defined in tsconfig
export * from '../../src/models'

export type IDBDocChange = functions.Change<FirebaseFirestore.DocumentSnapshot>