import * as React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { Howto } from './Content/Howto/Howto'
import CreateHowto from './Content/CreateHowto/CreateHowto'
import { EditHowto } from './Content/EditHowto/EditHowto'
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
          <Route
            path="/how-to/create"
            component={CreateHowto}
            redirectPath="/how-to"
          />
          <Route
            path="/how-to/:slug"
            exact
            render={props => <Howto {...props} />}
          />
          <Route
            path="/how-to/:slug/edit"
            render={props => <EditHowto {...props} />}
          />
        </Switch>
      </div>
    )
  }
}
export const HowtoPage = withRouter(HowtoPageClass as any)
