import { Suspense } from 'react'
import { Routes } from '@remix-run/react'

// import { AuthRoute } from '../common/AuthRoute'
// import { QuestionCreate } from './QuestionCreate'
// import { QuestionEdit } from './QuestionEdit'
// import { QuestionPage } from './QuestionPage'

export const questionRouteElements = (
  <>
    {/* <Route path=":slug" element={<QuestionPage />} /> */}
    {/* <Route
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
    /> */}
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
