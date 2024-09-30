import { AuthRoute } from 'src/pages/common/AuthRoute'
import { QuestionCreate } from 'src/pages/Question/QuestionCreate'

export async function clientLoader() {
  return null
}

export default function Index() {
  return (
    <AuthRoute>
      <QuestionCreate />
    </AuthRoute>
  )
}
