import React, { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AuthRoute } from '../common/AuthRoute'
import { HowtoList } from './Content/HowtoList/HowtoList'
import { Howto } from './Content/Howto/Howto'

// lazy load editor pages
const CreateHowto = lazy(
  () =>
    import(
      /* webpackChunkName: "CreateHowto" */ './Content/CreateHowto/CreateHowto'
    ),
)
const EditHowto = lazy(
  () =>
    import(/* webpackChunkName: "EditHowto" */ './Content/EditHowto/EditHowto'),
)

const HowtoPage = () => {
  return (
    <Suspense fallback={<div></div>}>
      <Routes>
        <Route index element={<HowtoList />} />
        <Route
          path="create"
          element={
            <AuthRoute>
              <CreateHowto />
            </AuthRoute>
          }
        />
        <Route path=":slug" element={<Howto />} />
        <Route
          path=":slug/edit"
          element={
            <AuthRoute>
              <EditHowto />
            </AuthRoute>
          }
        />
      </Routes>
    </Suspense>
  )
}

export default HowtoPage
