import Academy from 'src/pages/Academy/Academy'
import Main from 'src/pages/common/Layout/Main'
import { Layout } from 'src/pages/Layout'
import { SeoTagsUpdateComponent } from 'src/utils/seo'

export async function clientLoader() {
  return null
}

export default function Index() {
  return (
    <Layout>
      <SeoTagsUpdateComponent title="Academy" />
      <Main
        data-cy="main-layout-container"
        style={{ flex: 1 }}
        customStyles={{ flex: 1 }}
        ignoreMaxWidth={true}
      >
        <Academy />
      </Main>
    </Layout>
  )
}
