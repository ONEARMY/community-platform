import type { DBQueryOptions } from '../types/dbDoc'

/**
 * For mapping queries it is easiest to provide a common subset of defaults
 * which are designed to prevent accidental alter to the desired data structure
 */
const DB_QUERY_DEFAULTS: DBQueryOptions = {
  limit: undefined,
  order: 'asc',
  orderBy: '_id',
}

export const getQueryOptions = (queryOpts: DBQueryOptions) => {
  return {
    ...DB_QUERY_DEFAULTS,
    ...queryOpts,
  }
}
