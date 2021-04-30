import React, { Suspense, lazy } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
const CreateResearch = lazy(() => import('./Content/CreateResearch'))
const CreateUpdate = lazy(() => import('./Content/CreateUpdate'))
const ResearchItemEditor = lazy(() => import('./Content/EditResearch'))
const UpdateItemEditor = lazy(() => import('./Content/EditUpdate'))
const ResearchItemDetail = lazy(() => import('./Content/ResearchItemDetail'))
const ResearchList = lazy(() => import('./Content/ResearchList'))

const routes = () => (
  <Suspense fallback={<div></div>}>
    <Switch>
      <Route exact path="/research" component={ResearchList} />
      <Route
        path="/research/create"
        component={CreateResearch}
        redirectPath="/research"
      />
      <Route exact path="/research/:slug/new-update" component={CreateUpdate} />
      <Route exact path="/research/:slug/edit" component={ResearchItemEditor} />
      <Route
        exact
        path="/research/:slug/edit-update/:update"
        component={UpdateItemEditor}
      />
      <Route
        path="/research/:slug"
        render={routeProps => (
          <ResearchItemDetail slug={routeProps.match.params.slug} />
        )}
      />
    </Switch>
  </Suspense>
)

export default withRouter(routes)
