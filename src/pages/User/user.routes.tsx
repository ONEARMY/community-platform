import { Route, Routes, useParams } from 'react-router-dom'
import { UserProfile } from './content/UserProfile'
import { NotFoundPage } from '../NotFound/NotFound'
import { AuthRoute } from '../common/AuthRoute'
import { SettingsPage } from '../UserSettings/SettingsPage'

const userRouteElements = (id) => (
  <>
    <Route path=":id" element={<UserProfile />} />
    <Route
      path=":id/edit"
      element={
        <AuthRoute roleRequired="admin">
          {' '}
          <SettingsPage adminEditableUserId={id} />{' '}
        </AuthRoute>
      }
    />
    <Route index element={<NotFoundPage />} />
  </>
)

const UserProfileRoutes = () => {
  const { id } = useParams()

  return <Routes>{userRouteElements(id)}</Routes>
}

export default UserProfileRoutes
