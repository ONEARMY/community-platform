import { Suspense, lazy } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { Link } from 'src/components/Links'
import Text from 'src/components/Text'
import { IPageMeta } from 'src/pages/PageList'

// Any experimental modules can be defined here
const modules: IPageMeta[] = [
  {
    component: lazy(() => import('./mapRFC')),
    title: 'Map RFC',
    description: 'Test implementation of modular map system',
    path: 'mapRFC',
    moduleName: 'MapRFC' as any,
  },
]

const ModuleList = () => (
  <>
    <h1>Experimental Modules</h1>
    {modules.map(module => (
      <>
        <Link key={module.moduleName} to={`/experimental/${module.path}`}>
          {module.title}
        </Link>
        <Text mb={4}>{module.description}</Text>
      </>
    ))}
  </>
)

const routes = () => (
  <Suspense fallback={<div></div>}>
    <Switch>
      <Route exact path="/experimental" component={ModuleList} />
      {modules.map(module => (
        <Route
          key={module.moduleName}
          path={`/experimental/${module.path}`}
          component={module.component}
        />
      ))}
    </Switch>
  </Suspense>
)

export default withRouter(routes)
