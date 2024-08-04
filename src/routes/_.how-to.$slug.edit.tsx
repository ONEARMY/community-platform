/* eslint-disable unicorn/filename-case */
import { AuthRoute } from 'src/pages/common/AuthRoute'
import Main from 'src/pages/common/Layout/Main'
import EditHowto from 'src/pages/Howto/Content/EditHowto/EditHowto'
import { SeoTagsUpdateComponent } from 'src/utils/seo'

export async function clientLoader() {
  return null
}

export default function Index() {
  return (
    <Main style={{ flex: 1 }}>
      <SeoTagsUpdateComponent title="How To" />
      <AuthRoute>
        <EditHowto />
      </AuthRoute>
    </Main>
  )
}
