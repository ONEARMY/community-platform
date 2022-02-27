export type UserRole = 'super-admin' | 'subscriber' | 'admin' | 'beta-tester'

interface IMockAuthUser {
  uid: string
  label: string
  email?: string
  password?: string
  roles: UserRole[]
}

/** A list of specific demo/mock users that are prepopulated onto testing sites for use in development */

export const MOCK_AUTH_USERS: { [key in UserRole]: IMockAuthUser } = {
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
