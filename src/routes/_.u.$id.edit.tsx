import { UserRole } from 'oa-shared'
import { AuthRoute } from 'src/pages/common/AuthRoute'
import Main from 'src/pages/common/Layout/Main'
import { SettingsPage } from 'src/pages/UserSettings/SettingsPage'
import { SeoTagsUpdateComponent } from 'src/utils/seo'

export async function clientLoader() {
  return null
}

export default function Index() {
  return (
    <Main style={{ flex: 1 }}>
      <SeoTagsUpdateComponent title="Profile" />
      <AuthRoute roleRequired={UserRole.ADMIN}>
        <SettingsPage />
      </AuthRoute>
    </Main>
  )
}
