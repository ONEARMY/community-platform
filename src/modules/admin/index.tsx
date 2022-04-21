import type { IPageMeta } from 'src/pages/PageList'
import { AdminStoreContext, AdminStore } from './admin.store'
import { MODULE } from '..'
import adminRoutes from './admin.routes'
import AdminSubheader from './components/admin-subheader'
import { AuthRoute } from 'src/pages/common/AuthRoute'

const moduleName = MODULE.ADMIN

export const AdminModule: IPageMeta = {
  moduleName,
  path: `/${moduleName}`,
  component: <AdminModuleContainer />,
  title: 'Admin',
  description: 'Admin Home Page',
  requiredRole: 'admin',
}

/**
 * Wraps the research module routing elements with the research module provider
 */
function AdminModuleContainer() {
  return (
    <AdminStoreContext.Provider value={new AdminStore()}>
      <AdminSubheader />
      <AuthRoute component={adminRoutes} roleRequired="admin" redirect="/" />
      <div>Coming Soon...</div>
    </AdminStoreContext.Provider>
  )
}
