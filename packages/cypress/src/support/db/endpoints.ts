import { generateDBEndpoints } from 'oa-shared'

// React apps populate a process variable, however it might not always be accessible outside
// (e.g. cypress will instead use it's own env to populate a prefix)

/**
 * A prefix can be used to simplify large-scale schema changes or multisite hosting
 * and allow multiple sites to use one DB (used for parallel test seed DBs)
 * e.g. oa_
 * SessionStorage prefixes are used to allow test ci environments to dynamically set a db endpoint
 */

/**
 * Mapping of generic database endpoints to specific prefixed and revisioned versions for the
 * current implementation
 * @example
 * ```
 * const allHowtos = await db.get(DB_ENDPOINTS.howtos)
 * ```
 */
export const DB_ENDPOINTS = generateDBEndpoints()

export type DBEndpoint = keyof typeof DB_ENDPOINTS
