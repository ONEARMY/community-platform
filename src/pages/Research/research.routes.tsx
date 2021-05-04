import { Route, Switch, withRouter } from 'react-router-dom'
import { AuthRoute } from '../common/AuthRoute'
import CreateResearch from './Content/CreateResearch'
import CreateUpdate from './Content/CreateUpdate'
import ResearchItemEditor from './Content/EditResearch'
import UpdateItemEditor from './Content/EditUpdate'
import { ResearchItemDetail } from './Content/ResearchItemDetail'
import { ResearchList } from './Content/ResearchList'

const routes = () => (
  <Switch>
    <AuthRoute
      exact
      path="/research"
      component={ResearchList}
      roleRequired="beta-tester"
    />
    <AuthRoute
      path="/research/create"
      component={CreateResearch}
      roleRequired="beta-tester"
    />
    <AuthRoute
      exact
      path="/research/:slug/new-update"
      component={CreateUpdate}
      roleRequired="beta-tester"
    />
    <AuthRoute
      exact
      path="/research/:slug/edit"
      component={ResearchItemEditor}
      roleRequired="beta-tester"
    />
    <AuthRoute
      exact
      path="/research/:slug/edit-update/:update"
      component={UpdateItemEditor}
      roleRequired="beta-tester"
    />
    <AuthRoute
      path="/research/:slug"
      roleRequired="beta-tester"
      render={routeProps => (
        <ResearchItemDetail slug={routeProps.match.params.slug as string} />
      )}
    />
  </Switch>
)

export default withRouter(routes)
