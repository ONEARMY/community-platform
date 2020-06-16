import * as React from 'react'
import {
  Route,
  Switch,
  withRouter,
  RouteComponentProps,
} from 'react-router-dom'
import { Howto } from './Content/Howto/Howto'
import CreateHowto from './Content/CreateHowto/CreateHowto'
import { EditHowto } from './Content/EditHowto/EditHowto'
import { HowtoList } from './Content/HowtoList/HowtoList'
import { inject } from 'mobx-react'
import { HowtoStore } from 'src/stores/Howto/howto.store'

interface IProps extends RouteComponentProps {
  howtoStore?: HowtoStore
}

@inject('howtoStore')
class HowtoPage extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props)
    this.props.howtoStore!.init()
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
export default withRouter(HowtoPage)
