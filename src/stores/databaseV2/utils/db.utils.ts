import { DBQueryOptions } from '../types'

/**
 * For mapping queries it is easiest to provide a common subset of defaults
 * which are designed to prevent accidental alter to the desired data structure
 */
export const DB_QUERY_DEFAULTS: DBQueryOptions = {
  limit: undefined,
  order: 'asc',
  orderBy: '_id',
}
