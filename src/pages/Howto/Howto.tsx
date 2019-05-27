import * as React from 'react'
import { inject, observer } from 'mobx-react'

import { HowtoStore } from 'src/stores/Howto/howto.store'
import { Route, Switch, withRouter } from 'react-router-dom'
import { Howto } from './Content/Howto/Howto'
import { CreateHowto } from './Content/CreateHowto/CreateHowto'
import { HowtoList } from './Content/HowtoList/HowtoList'
import { AuthRoute } from '../common/AuthRoute'

interface IProps {
  howtoStore?: HowtoStore
}

// We're connecting to the 'docStore' state object and will pass down through child compoennts
// First we use the @inject decorator to bind to the docStore state
@inject('howtoStore')
// Then we can use the observer component decorator to automatically tracks observables and re-renders on change
@observer
class HowtoPageClass extends React.Component<IProps, any> {
  constructor(props: IProps) {
    super(props)
  }

  public render() {
    // mobx will automatically re-render when it sees updates to the following properties
    // (note 1, use ! to tell typescript that the store will exist (it's an injected prop))
    // (note 2, mobx seems to behave more consistently when observables are referenced outside of render methods)
    const allHowtos = this.props.howtoStore!.allHowtos
    return (
      <div>
        <Switch>
          <Route
            exact
            path="/how-to"
            render={props => <HowtoList {...props} allHowtos={allHowtos} />}
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
