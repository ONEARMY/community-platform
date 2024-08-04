import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { isPreciousPlastic } from 'src/config/config'
import { AuthRoute } from 'src/pages/common/AuthRoute'
import Main from 'src/pages/common/Layout/Main'
import { RESEARCH_EDITOR_ROLES } from 'src/pages/Research/constants'
import CreateResearch from 'src/pages/Research/Content/CreateResearch'
import {
  ResearchStore,
  ResearchStoreContext,
} from 'src/stores/Research/research.store'

export async function clientLoader() {
  return null
}

export default function Index() {
  const roles = isPreciousPlastic() ? [] : RESEARCH_EDITOR_ROLES
  const rootStore = useCommonStores()

  return (
    <Main style={{ flex: 1 }}>
      <ResearchStoreContext.Provider value={new ResearchStore(rootStore)}>
        <AuthRoute roleRequired={roles}>
          <CreateResearch />
        </AuthRoute>
      </ResearchStoreContext.Provider>
    </Main>
  )
}
