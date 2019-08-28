import * as React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { Howto } from './Content/Howto/Howto'
import { CreateHowto } from './Content/CreateHowto/CreateHowto'
import { HowtoList } from './Content/HowtoList/HowtoList'
import { AuthRoute } from '../common/AuthRoute'

class HowtoPageClass extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  public render() {
    return (
      <div>
        <Switch>
          <Route
            exact
            path="/how-to"
            render={props => <HowtoList {...props} />}
          />
          {/* auth route only renders for logged in users */}
          <AuthRoute
            path="/how-to/create"
            component={CreateHowto}
            redirectPath="/how-to"
          />
          <Route path="/how-to/:slug" render={props => <Howto {...props} />} />
        </Switch>
      </div>
    )
  }
}
export const HowtoPage = withRouter(HowtoPageClass as any)
