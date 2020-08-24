import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { EventStore } from 'src/stores/Events/events.store'
import { EventsCreate } from './Content/EventsCreate/EventsCreate'
import { EventsList } from './Content/EventsList/EventsList'

import { withRouter, Switch, Route } from 'react-router'
import { AuthRoute } from '../common/AuthRoute'

// see similar implementation in 'how-to' page for more detailed commenting
interface IProps {
  eventStore?: EventStore
}

@inject('eventStore')
@observer
class EventsPageClass extends React.Component<IProps, any> {
  // eslint-disable-next-line
  constructor(props: any) {
    super(props)
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
        <AuthRoute
          path="/events/create"
          component={EventsCreate}
          redirectPath="/events"
        />
      </Switch>
    )
  }
}
export const EventsPage: any = withRouter(EventsPageClass as any)
