import { useCommonStores } from 'src/common/hooks/useCommonStores'
import Main from 'src/pages/common/Layout/Main'
import { Layout } from 'src/pages/Layout'
import ResearchArticle from 'src/pages/Research/Content/ResearchArticle'
import {
  ResearchStore,
  ResearchStoreContext,
} from 'src/stores/Research/research.store'

export async function clientLoader() {
  return null
}

export default function Index() {
  const rootStore = useCommonStores()

  return (
    <Layout>
      <Main data-cy="main-layout-container" style={{ flex: 1 }}>
        <ResearchStoreContext.Provider value={new ResearchStore(rootStore)}>
          <ResearchArticle />
        </ResearchStoreContext.Provider>
      </Main>
    </Layout>
  )
}
