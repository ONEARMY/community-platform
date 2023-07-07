import { Suspense, lazy } from 'react'
import { AuthRoute } from '../common/AuthRoute'
import { Route, Switch, withRouter } from 'react-router-dom'
import { RESEARCH_EDITOR_ROLES } from './constants'
const CreateResearch = lazy(
  () =>
    import(/* webpackChunkName: "CreateResearch" */ './Content/CreateResearch'),
)
const CreateUpdate = lazy(
  () =>
    import(
      /* webpackChunkName: "CreateResearchUpdate" */ './Content/CreateUpdate'
    ),
)
const ResearchItemEditor = lazy(
  () => import(/* webpackChunkName: "EditResearch" */ './Content/EditResearch'),
)
const UpdateItemEditor = lazy(
  () =>
    import(/* webpackChunkName: "EditResearchUpdate" */ './Content/EditUpdate'),
)
const ResearchArticle = lazy(
  () =>
    import(
      /* webpackChunkName: "ResearchArticle" */ './Content/ResearchArticle'
    ),
)
const ResearchList = lazy(
  () => import(/* webpackChunkName: "ResearchList" */ './Content/ResearchList'),
)

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max)
}

const routes = () => (
  <Suspense fallback={<div></div>}>
    <Switch>
      <Route exact path="/research" component={ResearchList} />
      <AuthRoute
        path="/research/create"
        component={CreateResearch}
        roleRequired={RESEARCH_EDITOR_ROLES}
      />
      <AuthRoute
        exact
        path="/research/:slug/new-update"
        component={CreateUpdate}
        roleRequired={RESEARCH_EDITOR_ROLES}
      />
      <AuthRoute
        exact
        path="/research/:slug/edit"
        component={ResearchItemEditor}
        roleRequired={RESEARCH_EDITOR_ROLES}
      />
      <AuthRoute
        exact
        path="/research/:slug/edit-update/:update"
        component={UpdateItemEditor}
        roleRequired={RESEARCH_EDITOR_ROLES}
      />
      <Route
        exact
        path="/research/:slug"
        key={getRandomInt(55555)}
        component={ResearchArticle}
      />
    </Switch>
  </Suspense>
)

export default withRouter(routes) as React.ComponentType
