import * as React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { ResearchList } from './Content/ResearchList'

const routes = () => (
  <Switch>
    <Route exact path="/research" component={ResearchList} />
  </Switch>
)

export default withRouter(routes)
