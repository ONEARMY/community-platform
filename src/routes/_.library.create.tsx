/* eslint-disable unicorn/filename-case */
import { AuthRoute } from 'src/pages/common/AuthRoute'
import CreateLibrary from 'src/pages/Library/CreateLibrary'

export async function clientLoader() {
  return null
}

export default function Index() {
  return (
    <AuthRoute>
      <CreateLibrary />
    </AuthRoute>
  )
}
