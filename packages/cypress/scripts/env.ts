import fs from 'fs-extra'

import { generateAlphaNumeric } from '../src/utils/TestUtils'
import PATHS from './paths'

const DB_PREFIX = `DB_PREFIX=${generateAlphaNumeric(5)}_`

try {
    fs.appendFile(PATHS.DOT_ENV, '\n' + DB_PREFIX, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Content appended successfully!');
      }
    });
  } catch (err) {
    console.error(err);
}
