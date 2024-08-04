/* eslint-disable unicorn/filename-case */
import Main from 'src/pages/common/Layout/Main'
import SignUpMessagePage from 'src/pages/SignUp/SignUpMessage'
import { SeoTagsUpdateComponent } from 'src/utils/seo'

export async function clientLoader() {
  return null
}

export default function Index() {
  return (
    <Main style={{ flex: 1 }}>
      <SeoTagsUpdateComponent title="Sign Up" />
      <SignUpMessagePage />
    </Main>
  )
}
