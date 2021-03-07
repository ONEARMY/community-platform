import React from 'react'
import {
  ResearchStore,
  ResearchStoreContext,
} from 'src/stores/Research/research.store'
import ResearchRoutes from './research.routes'

/**
 * Default export format used for integrating with the platform
 * @description The research module enables users to share ongoing updates for
 * experimental projects
 */
export const ResearchModule = {
  path: '/research',
  component: <ResearchModuleContainer />,
  title: 'Research',
  description: 'Welcome to research',
}

/**
 * Wraps the research module routing elements with the research module provider
 */
function ResearchModuleContainer() {
  return (
    <ResearchStoreContext.Provider value={new ResearchStore()}>
      <ResearchRoutes />
    </ResearchStoreContext.Provider>
  )
}
