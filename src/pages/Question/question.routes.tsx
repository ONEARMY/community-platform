import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import { AuthRoute } from '../common/AuthRoute'
import { QuestionCreate } from './QuestionCreate'
import { QuestionEdit } from './QuestionEdit'
import { QuestionListing } from './QuestionListing'
import { QuestionPage } from './QuestionPage'

export const questionRouteElements = (
  <>
    <Route index element={<QuestionListing />} />
    <Route path=":slug" element={<QuestionPage />} />
    <Route
      path="create"
      element={
        <AuthRoute>
          <QuestionCreate />
        </AuthRoute>
      }
    />
    <Route
      path=":slug/edit"
      element={
        <AuthRoute>
          <QuestionEdit />
        </AuthRoute>
      }
    />
  </>
)

const QuestionRoutes = () => {
  return (
    <Suspense fallback={<div></div>}>
      <Routes>{questionRouteElements}</Routes>
    </Suspense>
  )
}

export default QuestionRoutes
