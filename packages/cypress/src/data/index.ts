/**
 * Simple re-export of all the data within the oa-shared mocks
 * Can be imported locally as individual namespaces or combined
 * @example
 * ```
 * import { library } from '../data'
 * ```
 * or
 * ```
 * import { MOCK_DATA } from '../data
 * ```
 *
 **/

import * as allData from 'oa-shared/mocks/data'

export const MOCK_DATA = {
  ...allData,
}
