import Main from 'src/pages/common/Layout/Main'
import { UserProfile } from 'src/pages/User/content/UserProfile'
import { SeoTagsUpdateComponent } from 'src/utils/seo'

export async function clientLoader() {
  return null
}

export default function Index() {
  return (
    <Main style={{ flex: 1 }}>
      <SeoTagsUpdateComponent title="Profile" />
      <UserProfile />
    </Main>
  )
}
