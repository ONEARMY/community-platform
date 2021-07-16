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
  tags: `${DB_PREFIX}v3_tags`,
  events: `${DB_PREFIX}v3_events`,
  mappins: `${DB_PREFIX}v3_mappins`,
  research: `${DB_PREFIX}research_rev20201020`,
})
