import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { UserRole } from 'oa-shared'

import { AuthRoute } from '../common/AuthRoute'

const Dashboard = lazy(
  () => import(/* webpackChunkName: "AdminDashboard" */ './Content/Dashboard'),
)

const routes = () => (
  <Suspense fallback={<div></div>}>
    <Routes>
      <Route
        path="/"
        element={
          <AuthRoute roleRequired={[UserRole.ADMIN]}>
            <Dashboard />
          </AuthRoute>
        }
      />
    </Routes>
  </Suspense>
)

export default routes
