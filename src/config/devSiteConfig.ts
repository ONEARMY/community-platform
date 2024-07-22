import type { UserRole } from '../models'

export const getDevSiteRole = () =>
  localStorage.getItem('devSiteRole') as UserRole
