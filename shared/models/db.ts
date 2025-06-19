import type { ISODateString } from './common'

/*************************************************************************************
 * Generate a list of DB endpoints used in the app
 *
 * @param prefix - provide optional prefix to simplify large-scale schema changes or
 * multisite hosting and allow multiple sites to use one DB (used for parallel test seed DBs)
 * e.g. oa_
 *
 * NOTE - these are a bit messy due to various migrations and changes
 * In the future all endpoints should try to just retain prefix-base-revision, e.g. oa_users_rev20201012
 **************************************************************************************/
export const generateDBEndpoints = () => ({
  users: `v3_users`,
  user_notifications: `user_notifications_rev20221209`,
  mappins: `v3_mappins`,
  emails: `emails`,
  tags: `v3_tags`,
  user_integrations: `user_integrations`,
})

/**
 * A list of known subcollections used in endpoints, e.g.
 * /library/my-project-id/stats
 */
export const dbEndpointSubcollections = {
  user: ['revisions'],
  library: ['stats'],
  research: ['stats'],
}
// React apps populate a process variable, however it might not always be accessible outside
// (e.g. cypress will instead use it's own env to populate a prefix)

// Hack - allow calls to process from cypress testing (react polyfills process.env otherwise)
if (!('process' in globalThis)) {
  globalThis.process = {} as any
}

/**
 * Mapping of generic database endpoints to specific prefixed and revisioned versions for the
 * current implementation
 * @example
 * ```
 * const allLibraryItems = await db.get(DB_ENDPOINTS.library)
 * ```
 */
export const DB_ENDPOINTS = generateDBEndpoints()

export type DBEndpoint = keyof typeof DB_ENDPOINTS

export interface DBDoc {
  _id: string
  _created: ISODateString
  _modified?: ISODateString
  _deleted: boolean
  _contentModifiedTimestamp?: ISODateString
}
