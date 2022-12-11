import type { UserRole } from '../../models'

export interface IMockAuthUser {
  uid: string
  label: string
  email?: string
  password?: string
  roles: UserRole[]
}

type IMockUsers = { [key in UserRole]: IMockAuthUser }
/** A list of specific demo/mock users that are prepopulated onto testing sites for use in development */

export const MOCK_AUTH_USERS: IMockUsers = {
  subscriber: {
    uid: 'demo_user',
    label: 'User',
    email: 'demo_user@example.com',
    password: 'demo_user',
    roles: [],
  },
  'beta-tester': {
    uid: 'demo_beta_tester',
    label: 'Beta-Tester',
    email: 'demo_beta_tester@example.com',
    password: 'demo_beta_tester',
    roles: ['beta-tester'],
  },
  admin: {
    uid: 'demo_admin',
    label: 'Admin',
    email: 'demo_admin@example.com',
    password: 'demo_admin',
    roles: ['admin'],
  },
  'super-admin': {
    uid: 'demo_super_admin',
    label: 'Super-Admin',
    email: 'demo_super_admin@example.com',
    password: 'demo_super_admin',
    roles: ['super-admin'],
  },
}
