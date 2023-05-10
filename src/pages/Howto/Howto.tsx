import { inject } from 'mobx-react'
import React, { lazy, Suspense } from 'react'
import type { RouteComponentProps } from 'react-router-dom'
import { Route, Switch, withRouter } from 'react-router-dom'
import type { AggregationsStore } from 'src/stores/Aggregations/aggregations.store'
import type { HowtoStore } from 'src/stores/Howto/howto.store'
import { Howto } from './Content/Howto/Howto'
import { HowtoList } from './Content/HowtoList/HowtoList'
import { AuthRoute } from '../common/AuthRoute'
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
  aggregationsStore?: AggregationsStore
}

@inject('howtoStore', 'aggregationsStore')
class HowtoPage extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props)
    this.props.howtoStore!.init()
  }

  componentDidMount() {
    // Ensure aggregations up-to-date when using any child pages
    this.props.aggregationsStore!.updateAggregation('users_votedUsefulHowtos')
  }
  componentWillUnmount() {
    // Stop receiving updates when navigating away from child pages
    this.props.aggregationsStore!.stopAggregationUpdates(
      'users_votedUsefulHowtos',
    )
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
