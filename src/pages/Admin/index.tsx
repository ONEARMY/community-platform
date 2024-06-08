import { UserRole } from 'oa-shared'
import { MODULE } from 'src/modules'

import Routes from './routes'

import type { IPageMeta } from 'src/pages/PageList'

const ModuleContainer = () => {
  return <Routes />
}

/**
 * Default export format used for integrating with the platform
 * @description The admin module is for site maintainers to do meta-tasks.
 */
export const AdminModule: IPageMeta = {
  moduleName: MODULE.CORE,
  path: '/admin',
  component: <ModuleContainer />,
  title: 'Admin',
  description: 'Thanks for your labor!',
  requiredRole: UserRole.ADMIN,
}
