import { AuthRoute } from 'src/pages/common/AuthRoute'
import type { IPageMeta } from 'src/pages/PageList'
import adminRoutes from './admin.routes'
import { AdminStoreV2, AdminStoreV2Context } from './admin.storeV2'
import AdminSubheader from './components/AdminSubheader'
import { MODULE } from '..'

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
