import Main from 'src/pages/common/Layout/Main'
import { Layout } from 'src/pages/Layout'
import Patreon from 'src/pages/Patreon/Patreon'
import { SeoTagsUpdateComponent } from 'src/utils/seo'

export async function clientLoader() {
  return null
}

export default function Index() {
  return (
    <Layout>
      <Main data-cy="main-layout-container" style={{ flex: 1 }}>
        <SeoTagsUpdateComponent title="Patreon" />
        <Patreon />
      </Main>
    </Layout>
  )
}
