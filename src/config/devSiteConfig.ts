import type { UserRole } from '../models/user.models'

export const getDevSiteRole = () =>
  localStorage.getItem('devSiteRole') as UserRole
