import { MODULE } from 'src/modules'
import type { IPageMeta } from '../PageList'
import { Route } from 'react-router'
import directoryRoutes from './directory.routes'

const DirectoryModuleContainer = () => {
  return <Route component={directoryRoutes} />
}

export const DirectoryModule: IPageMeta = {
  moduleName: MODULE.MAP,
  path: '/directory',
  component: <DirectoryModuleContainer />,
  title: 'Directory',
  description: 'Welcome to directory',
}
