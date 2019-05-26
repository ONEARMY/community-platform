import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { EventStore } from 'src/stores/Events/events.store'
import { EventsCreate } from './Content/EventsCreate/EventsCreate'
import { EventsList } from './Content/EventsList/EventsList'

import { withRouter, Switch, Route } from 'react-router'
import { AuthRoute } from '../common/AuthRoute'

interface IProps {
  eventStore?: EventStore
}

@inject('eventStore')
@observer
class EventsPageClass extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props)
  }

  public async componentDidMount() {
    // call methods you want to fire once when component mounted
    await this.props.eventStore!.getEventsList()
    this.forceUpdate()
  }

  public render() {
    return (
      <div id="EventsPage">
        <Switch>
          <Route
            exact
            path="/events"
            render={props => (
              <EventsList
                {...props}
                allEvents={this.props.eventStore!.allEvents}
              />
            )}
          />
          <AuthRoute
            path="/events/create"
            component={EventsCreate}
            redirectPath="/events"
          />
        </Switch>
      </div>
    )
  }
}
export const EventsPage = withRouter(EventsPageClass as any)
