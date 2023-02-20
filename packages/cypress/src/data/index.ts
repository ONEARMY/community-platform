/**
 * Simple re-export of all the data within the oa-shared mocks
 * Can be imported locally as individual namespaces or combined
 * @example
 * ```
 * import { howtos } from '../data'
 * ```
 * or
 * ```
 * import { MOCK_DATA } from '../data
 * ```
 *
 **/

import {
  categories,
  events,
  howtos,
  mappins,
  research,
  tags,
  users,
} from 'oa-shared/mocks/data'

export { howtos, users } from 'oa-shared/mocks/data'

export const MOCK_DATA = {
  categories,
  events,
  howtos,
  mappins,
  research,
  tags,
  users,
}
