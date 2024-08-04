import { AuthRoute } from 'src/pages/common/AuthRoute'
import { QuestionEdit } from 'src/pages/Question/QuestionEdit'

export async function clientLoader() {
  return null
}

export default function Index() {
  return (
    <AuthRoute>
      <QuestionEdit />
    </AuthRoute>
  )
}
