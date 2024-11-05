import { Outlet } from '@remix-run/react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import Main from 'src/pages/common/Layout/Main'
import {
  ResearchStore,
  ResearchStoreContext,
} from 'src/stores/Research/research.store'

export async function loader() {
  return null
}

// This is a Layout file, it will render for all research routes
export default function Index() {
  const rootStore = useCommonStores()

  return (
    <Main style={{ flex: 1 }}>
      <ResearchStoreContext.Provider value={new ResearchStore(rootStore)}>
        <Outlet />
      </ResearchStoreContext.Provider>
    </Main>
  )
}
