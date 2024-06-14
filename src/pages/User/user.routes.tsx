import { Route, Routes } from 'react-router-dom'
import { UserRole } from 'oa-shared'

import { AuthRoute } from '../common/AuthRoute'
import { NotFoundPage } from '../NotFound/NotFound'
import { SettingsPage } from '../UserSettings/SettingsPage'
import { UserProfile } from './content/UserProfile'

export const UserRoutes = (
  <>
    <Route path=":id" element={<UserProfile />} />
    <Route
      path=":id/edit"
      element={
        <AuthRoute roleRequired={UserRole.ADMIN}>
          <SettingsPage />
        </AuthRoute>
      }
    />
    <Route index element={<NotFoundPage />} />
  </>
)

const UserProfileRoutes = () => <Routes>{UserRoutes}</Routes>

export default UserProfileRoutes
