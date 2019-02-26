import * as React from 'react'
import { inject, observer } from 'mobx-react'
import logo from '../../assets/images/logo.png'

import { HowtoStore } from 'src/stores/Howto/howto.store'
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import { Howto } from './Content/Howto/Howto'
import { CreateHowto } from './Content/CreateHowto/CreateHowto'
import { HowtoList } from './Content/HowtoList/HowtoList'

interface IProps {
  howtoStore: HowtoStore
  nonav: boolean
}

// We're connecting to the 'docStore' state object and will pass down through child compoennts
// First we use the @inject decorator to bind to the docStore state
@inject('howtoStore')
// Then we can use the observer component decorator to automatically tracks observables and re-renders on change
@observer
class HowtoPageClass extends React.Component<IProps, any> {
  constructor(props) {
    super(props)
  }

  public async componentDidMount() {
    // call getDocList to trigger update of database doc data when the page is loaded
    // this will be reflected in the props.howtoStore.docs object
    // it should automatically update components however for some reason failing to
    // so call force update after first update
    await this.props.howtoStore.getDocList()
    this.forceUpdate()
  }

  public render() {
    const { nonav } = this.props
    return (
      <div>
        {nonav && (
          <img
            src={logo}
            alt="precious plastic logo"
            style={{ display: 'block', margin: '0 auto', width: '200px' }}
          />
        )}
        <Switch>
          <Route
            exact path="/how-to"
            render={props => <HowtoList {...props}
            allHowtos={this.props.howtoStore.allHowtos} />}
          />
          <Route path="/how-to/create" component={CreateHowto} />
          <Route path="/how-to/:slug" render={props => <Howto {...props} />} />
        </Switch>
      </div>
    )
  }
}
export const HowtoPage = withRouter(HowtoPageClass as any)
