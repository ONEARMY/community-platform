/*************************************************************************************
 * Shared Constants
 *
 * As constants cannot be directly imported from one workspace to another put them here
 **************************************************************************************/

/*************************************************************************************
 * IMPORTANT
 * We want to ensure the same db endpoints are used in frontend and backend functions,
 * however importing directly isn't very well supported for constants
 * (to fix with future migration to lerna or similar module system)
 *
 * Therefore these need to be kept manually in sync with src/stores/databaseV2/endpoints.ts
 **************************************************************************************/
const DB_PREFIX = ''
export const DB_ENDPOINTS = {
  howtos: `${DB_PREFIX}v3_howtos`,
  users: `${DB_PREFIX}v3_users`,
  tags: `${DB_PREFIX}v3_tags`,
  events: `${DB_PREFIX}v3_events`,
  mappins: `${DB_PREFIX}v3_mappins`,
  research: `${DB_PREFIX}research_rev20201020`,
}
