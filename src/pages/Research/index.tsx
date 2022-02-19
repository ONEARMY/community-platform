import { Route } from 'react-router'
import { MODULE } from 'src/modules'
import {
  ResearchStore,
  ResearchStoreContext,
} from 'src/stores/Research/research.store'
import type { IPageMeta } from '../PageList'
import ResearchRoutes from './research.routes'

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

/**
 * Wraps the research module routing elements with the research module provider
 */
function ResearchModuleContainer() {
  return (
    <ResearchStoreContext.Provider value={new ResearchStore()}>
      {/* <AuthRoute component={ResearchRoutes}      roleRequired={undefined}  /> */}
      <Route component={ResearchRoutes} />
    </ResearchStoreContext.Provider>
  )
}
