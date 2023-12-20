import React from 'react'
import { Route, Routes, useParams } from 'react-router-dom'
import { observer } from 'mobx-react'
import { UserPage } from './content'
import { NotFoundPage } from '../NotFound/NotFound'
import { AuthRoute } from '../common/AuthRoute'
import { SettingsPage } from '../UserSettings/SettingsPage'

const UserPageRoutes = observer(() => {
  const { id } = useParams()

  return (
    <Routes>
      <Route path=":id" element={<UserPage />} />
      <Route
        path=":id/edit"
        element={
          <AuthRoute roleRequired="admin">
            <SettingsPage adminEditableUserId={id} />
          </AuthRoute>
        }
      />

      <Route index element={<NotFoundPage />} />
    </Routes>
  )
})

export default UserPageRoutes
