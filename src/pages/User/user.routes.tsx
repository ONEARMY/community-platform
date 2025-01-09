import { Route, Routes } from '@remix-run/react'
import { UserRole } from 'oa-shared'

import { AuthRoute } from '../common/AuthRoute'
import { NotFoundPage } from '../NotFound/NotFound'
import { SettingsPage } from '../UserSettings/SettingsPage.client'
import { UserProfile } from './content/UserProfile'

import type { IUserDB } from 'oa-shared'

export const UserRoutes = (user: IUserDB) => (
  <>
    <Route
      path=":id"
      element={
        <UserProfile
          profile={user}
          userCreatedDocs={{ library: [], research: [] }}
        />
      }
    />
    <Route
      path=":id/edit"
      element={
        <AuthRoute roleRequired={UserRole.ADMIN}>
          <SettingsPage profile={user} />
        </AuthRoute>
      }
    />
    <Route index element={<NotFoundPage />} />
  </>
)

const UserProfileRoutes = (user: IUserDB) => <Routes>{UserRoutes(user)}</Routes>

export default UserProfileRoutes
