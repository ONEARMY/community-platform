const e = process.env
/**
 * @remark
 * - A prefix is used to simplify large-scale schema changes
 * (a new prefix will essentially start all users with clean DBs),
 * and allow multiple sites to use one DB (used for parallel test seed DBs)
 */
export const DB_PREFIX = e.REACT_APP_DB_PREFIX ? e.REACT_APP_DB_PREFIX : 'v3_'
