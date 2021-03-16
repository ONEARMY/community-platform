import * as React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import CreateResearch from './Content/CreateResearch'
import ResearchItemEditor from './Content/EditResearch'
import { ResearchItemDetail } from './Content/ResearchItemDetail'
import { ResearchList } from './Content/ResearchList'

const routes = () => (
  <Switch>
    <Route exact path="/research" component={ResearchList} />
    <Route
      path="/research/create"
      component={CreateResearch}
      redirectPath="/research"
    />
    <Route exact path="/research/:slug/edit" component={ResearchItemEditor} />
    <Route
      path="/research/:slug"
      render={routeProps => (
        <ResearchItemDetail slug={routeProps.match.params.slug} />
      )}
    />
  </Switch>
)

export default withRouter(routes)
