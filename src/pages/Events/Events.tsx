import React from 'react'
import { inject, observer } from 'mobx-react'
import { EventStore } from 'src/stores/Events/events.store'
import { EventsCreate } from './Content/EventsCreate/EventsCreate'
import { EventsList } from './Content/EventsList/EventsList'

import { withRouter, Switch, Route, RouteComponentProps } from 'react-router'
import { AuthRoute } from '../common/AuthRoute'

// see similar implementation in 'how-to' page for more detailed commenting
interface IProps extends RouteComponentProps {
  eventStore?: EventStore
}

@inject('eventStore')
@observer
class EventsPage extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props)
    this.props.eventStore!.init()
  }

  public render() {
    // const pastEvents = this.props.eventStore!.pastEvents
    return (
      <Switch>
        <Route
          exact
          path="/events"
          render={props => <EventsList {...props} />}
        />
        <AuthRoute path="/events/create" component={EventsCreate} />
      </Switch>
    )
  }
}
export default withRouter(EventsPage)
