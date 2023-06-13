import React, { Suspense, lazy } from 'react'
import type { RouteComponentProps } from 'react-router-dom'
import { Route, Switch, withRouter } from 'react-router-dom'
import { inject } from 'mobx-react'
import { AuthRoute } from '../common/AuthRoute'
import type { HowtoStore } from 'src/stores/Howto/howto.store'
import { HowtoList } from './Content/HowtoList/HowtoList'
import { Howto } from './Content/Howto/Howto'
// lazy load editor pages
const CreateHowto = lazy(
  () =>
    import(
      /* webpackChunkName: "CreateHowto" */ './Content/CreateHowto/CreateHowto'
    ),
)
const EditHowto = lazy(
  () =>
    import(/* webpackChunkName: "EditHowto" */ './Content/EditHowto/EditHowto'),
)

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
      <Suspense fallback={<div></div>}>
        <Switch>
          <Route
            exact
            path="/how-to"
            render={(props) => <HowtoList {...props} />}
          />
          <AuthRoute
            path="/how-to/create"
            component={CreateHowto}
            key="all-howtos"
          />
          <Route
            path="/how-to/:slug"
            exact
            render={(props) => (
              <Howto {...props} key={'how-to' + props.match.params.slug} />
            )}
          />
          <AuthRoute path="/how-to/:slug/edit" component={EditHowto} />
        </Switch>
      </Suspense>
    )
  }
}
export default withRouter(HowtoPage)
