import { Route } from 'react-router'
import type { IPageMeta } from 'src/pages/PageList'
import ExperimentalRoutes from './experimental.routes'

/**
 * The experimental module serves as a placeholder to display non-production and
 * testing modules within the main build. 
 */
export const ExperimentalModule: IPageMeta = {
  moduleName:'experimental' as any,
  path: '/experimental',
  component: <ExperimentalModuleContainer />,
  title: 'Experimental',
  description: 'Where things go boom',
}


function ExperimentalModuleContainer() {
  return <>
      <Route component={ExperimentalRoutes} />
      </>
}
