import * as functions from 'firebase-functions'

// Models can be imported from the main package for use here
// NOTE 1 - this requires adjustment main src in package.json
// NOTE 2 - shorthand @OAModels notation defined in tsconfig
export * from '../../src/models/common.models'
export * from '../../src/models/user.models'
export * from '../../src/models/howto.models'
export * from '../../src/models/events.models'

export type IDBDocChange = functions.Change<FirebaseFirestore.DocumentSnapshot>

// TODO - handle import from src/models (currently breaks ts setup)
// but possibly fixed by backend improvements pr
// NOTE - types import fine as skipLib=true, but consts have issue
const e = process.env
export const DB_PREFIX = e.REACT_APP_DB_PREFIX ? e.REACT_APP_DB_PREFIX : 'v3_'
