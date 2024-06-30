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
export declare const generateDBEndpoints: (DB_PREFIX?: string) => {
    howtos: string;
    users: string;
    user_notifications: string;
    tags: string;
    categories: string;
    researchCategories: string;
    mappins: string;
    messages: string;
    research: string;
    aggregations: string;
    emails: string;
    questions: string;
    questionCategories: string;
    user_integrations: string;
    discussions: string;
};
/**
 * A list of known subcollections used in endpoints, e.g.
 * /howtos/my-howto-id/stats
 */
export declare const dbEndpointSubcollections: {
    user: string[];
    howtos: string[];
    research: string[];
};
/**
 * Mapping of generic database endpoints to specific prefixed and revisioned versions for the
 * current implementation
 * @example
 * ```
 * const allHowtos = await db.get(DB_ENDPOINTS.howtos)
 * ```
 */
export declare const DB_ENDPOINTS: {
    howtos: string;
    users: string;
    user_notifications: string;
    tags: string;
    categories: string;
    researchCategories: string;
    mappins: string;
    messages: string;
    research: string;
    aggregations: string;
    emails: string;
    questions: string;
    questionCategories: string;
    user_integrations: string;
    discussions: string;
};
export type DBEndpoint = keyof typeof DB_ENDPOINTS;
