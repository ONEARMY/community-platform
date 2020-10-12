const e = process.env
/**
 * A prefix can be used to simplify large-scale schema changes or multisite hosting
 * and allow multiple sites to use one DB (used for parallel test seed DBs)
 * e.g. oa_
 */
const DB_PREFIX = e.REACT_APP_DB_PREFIX ? e.REACT_APP_DB_PREFIX : ''

/**
 * Mapping of generic database endpoints to specific prefixed and revisioned versions for the
 * current implementation
 * @example
 * ```
 * const allHowtos = await db.get(DB_ENDPOINTS.howtos)
 * ```
 * NOTE - these are a bit messy due to various migrations and changes
 * In the future all endpoints should try to just retain prefix-base-revision, e.g. oa_users_rev20201012
 */
export const DB_ENDPOINTS = {
  howtos: `${DB_PREFIX}v3_howtos`,
  users: `${DB_PREFIX}v3_users`,
  tags: `${DB_PREFIX}v3_tags`,
  events: `${DB_PREFIX}v3_events`,
  mappins: `${DB_PREFIX}v3_mappins`,
}
export type DBEndpoint = keyof typeof DB_ENDPOINTS
// legacy - want to use upper case naming convention but keep alternate until all code migrated
export const DBEndpoints = DB_ENDPOINTS
