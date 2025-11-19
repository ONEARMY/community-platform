import type { UserRole } from 'oa-shared';

export const getDevSiteRole = () => localStorage.getItem('devSiteRole') as UserRole;
