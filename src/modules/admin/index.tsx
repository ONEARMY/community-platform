import type { IPageMeta } from 'src/pages/PageList'
import { AdminStoreV2Context, AdminStoreV2 } from './admin.storeV2'
import { MODULE } from '..'
import adminRoutes from './admin.routes'
import AdminSubheader from './components/AdminSubheader'
import { AuthRoute } from 'src/pages/common/AuthRoute'

const moduleName = MODULE.ADMIN

/**
 * Wraps the research module routing elements with the research module provider
 */
const AdminModuleContainer = () => (
  <AdminStoreV2Context.Provider value={new AdminStoreV2()}>
    <AdminSubheader />
    <AuthRoute component={adminRoutes} roleRequired="admin" redirect="/" />
  </AdminStoreV2Context.Provider>
)

export const AdminModule: IPageMeta = {
  moduleName,
  path: `/${moduleName}`,
  component: <AdminModuleContainer />,
  title: 'Admin',
  description: 'Admin Home Page',
  requiredRole: 'admin',
}
