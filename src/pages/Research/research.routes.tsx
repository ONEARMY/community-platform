import * as React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { ResearchList } from './Content/ResearchList'
import { ResearchItemDetail } from './Content/ResearchItemDetail'

const routes = () => (
  <Switch>
    <Route exact path="/research" component={ResearchList} />
    <Route
      exact
      path="/research/create"
      // component={ResearchItemEditor}
    />
    <Route
      path="/research/:slug"
      render={routeProps => (
        <ResearchItemDetail slug={routeProps.match.params.slug} />
      )}
    />
    <Route
      exact
      path="/research/:slug/edit"
      // component={ResearchItemEditor}
    />
  </Switch>
)

export default withRouter(routes)
