/* eslint-disable unicorn/filename-case */
import Main from 'src/pages/common/Layout/Main'
import { Layout } from 'src/pages/Layout'
import SignUpMessagePage from 'src/pages/SignUp/SignUpMessage'
import { SeoTagsUpdateComponent } from 'src/utils/seo'

export async function clientLoader() {
  return null
}

export default function Index() {
  return (
    <Layout>
      <Main data-cy="main-layout-container" style={{ flex: 1 }}>
        <SeoTagsUpdateComponent title="Sign Up" />
        <SignUpMessagePage />
      </Main>
    </Layout>
  )
}
