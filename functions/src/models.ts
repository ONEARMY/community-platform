// tslint:disable no-implicit-dependencies
// Models can be imported from the main package for use here
// NOTE 1 - this requires adjustment main src in package.json
// NOTE 2 - shorthand @OAModels notation defined in tsconfig
import { IDBEndpoint, DBDoc } from '../../src/models/common.models'
import { IUser } from '../../src/models/user.models'
export { IDBEndpoint, DBDoc, IUser }

// TODO - handle import from src/models (currently breaks ts setup)
// but possibly fixed by backend improvements pr
// NOTE - types import fine as skipLib=true, but consts have issue
const e = process.env
export const DB_PREFIX = e.REACT_APP_DB_PREFIX ? e.REACT_APP_DB_PREFIX : 'v3_'
