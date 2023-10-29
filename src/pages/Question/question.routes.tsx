import { Suspense } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { QuestionListing } from './QuestionListing'
import { QuestionPage } from './QuestionPage'
import { QuestionCreate } from './QuestionCreate'
import { QuestionEdit } from './QuestionEdit'
import { AuthRoute } from '../common/AuthRoute'

const routes = () => {
  return (
    <Suspense fallback={<div></div>}>
      <Switch>
        <Route
          path="/question/:slug"
          exact
          render={(props) => {
            return (
              <QuestionPage
                {...props}
                key={'question' + props.match.params.slug}
              />
            )
          }}
        />

        <Route exact path="/questions">
          <QuestionListing />
        </Route>

        <AuthRoute
          path="/questions/create"
          component={QuestionCreate}
          key="questions-create"
        />

        <AuthRoute path="/question/:slug/edit" component={QuestionEdit} />
      </Switch>
    </Suspense>
  )
}

export default withRouter(routes) as React.ComponentType
