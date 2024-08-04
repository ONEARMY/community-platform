/* eslint-disable unicorn/filename-case */
import Main from 'src/pages/common/Layout/Main'
import SignInPage from 'src/pages/SignIn/SignIn'
import { SeoTagsUpdateComponent } from 'src/utils/seo'

export async function clientLoader() {
  return null
}

export default function Index() {
  return (
    <Main style={{ flex: 1 }}>
      <SeoTagsUpdateComponent title="Sign Up" />
      <SignInPage />
    </Main>
  )
}
