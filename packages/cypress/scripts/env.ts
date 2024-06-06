import fs from 'fs-extra'

import { generateAlphaNumeric } from '../src/utils/TestUtils'
import PATHS from './paths'

const DB_PREFIX = `DB_PREFIX=${generateAlphaNumeric(5)}_`

/**
 * In order to delete the DB collection according with the DB_PREFIX
 * the DB_PREFIX is append in the .env file
 */

try {
  fs.appendFile(PATHS.DOT_ENV, '\n' + DB_PREFIX, (err) => {
    if (err) {
      console.error(err)
    } else {
      console.log('Content appended successfully!')
    }
  })
} catch (err) {
  console.error(err)
}
