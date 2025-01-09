import { generateDBEndpoints } from 'oa-shared'

/**
 * Mapping of generic database endpoints to specific prefixed and revisioned versions for the
 * current implementation
 * @example
 * ```
 * const allLibraryProjects = await db.get(DB_ENDPOINTS.library)
 * ```
 */
export const DB_ENDPOINTS = generateDBEndpoints()

export type DBEndpoint = keyof typeof DB_ENDPOINTS
