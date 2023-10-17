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
        <Route exact path="/questions">
          <QuestionListing />
        </Route>

        <AuthRoute
          path="/questions/create"
          component={QuestionCreate}
          key="all-howtos"
        />

        <Route
          path="/questions/:slug"
          exact
          render={(props) => (
            <QuestionPage
              {...props}
              key={'questions' + props.match.params.slug}
            />
          )}
        />

        <AuthRoute path="/questions/:slug/edit" component={QuestionEdit} />
      </Switch>
    </Suspense>
  )
}

export default withRouter(routes) as React.ComponentType
