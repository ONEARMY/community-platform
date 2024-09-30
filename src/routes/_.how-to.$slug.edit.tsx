/* eslint-disable unicorn/filename-case */
import { AuthRoute } from 'src/pages/common/AuthRoute'
import EditHowto from 'src/pages/Howto/Content/EditHowto/EditHowto'

export async function clientLoader() {
  return null
}

export default function Index() {
  return (
    <AuthRoute>
      <EditHowto />
    </AuthRoute>
  )
}
