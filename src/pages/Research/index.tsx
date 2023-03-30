import { useEffect } from 'react'
import { Route } from 'react-router'
import { useCommonStores } from 'src'
import { MODULE } from 'src/modules'
import {
  ResearchStore,
  ResearchStoreContext,
} from 'src/stores/Research/research.store'
import type { IPageMeta } from '../PageList'
import ResearchRoutes from './research.routes'

/**
 * Wraps the research module routing elements with the research module provider
 */
const ResearchModuleContainer = () => {
  const { aggregationsStore } = useCommonStores().stores

  // Ensure aggregations up-to-date when using any child pages and unsubscribe when leaving
  useEffect(() => {
    aggregationsStore.updateAggregation('users_votedUsefulResearch')
    return () => {
      aggregationsStore.stopAggregationUpdates('users_votedUsefulResearch')
    }
  })

  return (
    <ResearchStoreContext.Provider value={new ResearchStore()}>
      {/* <AuthRoute component={ResearchRoutes}      roleRequired={undefined}  /> */}
      <Route component={ResearchRoutes} />
    </ResearchStoreContext.Provider>
  )
}

/**
 * Default export format used for integrating with the platform
 * @description The research module enables users to share ongoing updates for
 * experimental projects
 */
export const ResearchModule: IPageMeta = {
  moduleName: MODULE.RESEARCH,
  path: '/research',
  component: <ResearchModuleContainer />,
  title: 'Research',
  description: 'Welcome to research',
  // requiredRole: 'beta-tester',
}
