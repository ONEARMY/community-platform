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
export const generateDBEndpoints = (DB_PREFIX = '') => ({
  howtos: `${DB_PREFIX}v3_howtos`,
  users: `${DB_PREFIX}v3_users`,
  user_notifications: `${DB_PREFIX}user_notifications_rev20221209`,
  tags: `${DB_PREFIX}v3_tags`,
  categories: `${DB_PREFIX}v3_categories`,
  researchCategories: `${DB_PREFIX}research_categories_rev20221224`,
  mappins: `${DB_PREFIX}v3_mappins`,
  messages: `${DB_PREFIX}messages_rev20231022`,
  research: `${DB_PREFIX}research_rev20201020`,
  aggregations: `${DB_PREFIX}aggregations_rev20220126`,
  emails: `${DB_PREFIX}emails`,
  questions: `${DB_PREFIX}questions_rev20230926`,
  questionCategories: `${DB_PREFIX}question_categories_rev20231130`,
  user_integrations: `${DB_PREFIX}user_integrations`,
  discussions: `${DB_PREFIX}discussions_rev20231022`,
})

/**
 * A list of known subcollections used in endpoints, e.g.
 * /howtos/my-howto-id/stats
 */
export const dbEndpointSubcollections = {
  user: ['revisions'],
  howtos: ['stats'],
  research: ['stats'],
}
// React apps populate a process variable, however it might not always be accessible outside
// (e.g. cypress will instead use it's own env to populate a prefix)

// Hack - allow calls to process from cypress testing (react polyfills process.env otherwise)
if (!('process' in globalThis)) {
  globalThis.process = {} as any
}

const e = process.env || ({} as any)

// Check if sessionStorage exists (e.g. running in browser environment), and use if available
const storage =
  typeof sessionStorage === 'undefined' ? ({} as any) : sessionStorage

/**
 * A prefix can be used to simplify large-scale schema changes or multisite hosting
 * and allow multiple sites to use one DB (used for parallel test seed DBs)
 * e.g. oa_
 * SessionStorage prefixes are used to allow test ci environments to dynamically set a db endpoint
 */
const DB_PREFIX = storage.DB_PREFIX || e.VITE_DB_PREFIX || ''

/**
 * Mapping of generic database endpoints to specific prefixed and revisioned versions for the
 * current implementation
 * @example
 * ```
 * const allHowtos = await db.get(DB_ENDPOINTS.howtos)
 * ```
 */
export const DB_ENDPOINTS = generateDBEndpoints(DB_PREFIX)

export type DBEndpoint = keyof typeof DB_ENDPOINTS

export interface DBDoc {
  _id: string
  _created: ISODateString
  _modified?: ISODateString
  _deleted: boolean
  _contentModifiedTimestamp?: ISODateString
}
