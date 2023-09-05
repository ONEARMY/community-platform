import { Suspense } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { Directory } from './Directory'

const routes = () => {
  return (
    <Suspense fallback={<div></div>}>
      <Switch>
        <Route exact path="/directory">
          <Directory />
        </Route>
      </Switch>
    </Suspense>
  )
}

export default withRouter(routes) as React.ComponentType
