/*************************************************************************************  
This is an example page viewable at /template
For more info on pages see the Q & A at the bottom
**************************************************************************************/

import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { IStores } from 'src/stores'
import { EventStore } from 'src/stores/Events/events.store'
import { EventsCreate } from './Content/EventsCreate/EventsCreate'
import { EventsList } from './Content/EventsList/EventsList'

import { withRouter, Switch, Route } from 'react-router'
import { AuthRoute } from '../common/AuthRoute'

// define the page properties with typing information for fields
// properties are things that will have been passed down from parent component
// so for pages are likely to not contain much except perhaps global store objects
interface IProps {
  eventStore: EventStore
}

@inject((allStores: IStores) => ({
  eventStore: allStores.eventStore,
}))
@observer
class EventsPageClass extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props)
  }

  public async componentDidMount() {
    // call methods you want to fire once when component mounted
    await this.props.eventStore.getEventsList()
    this.forceUpdate()
  }

  public render() {
    {
      /* want to add background styled component when available */
    }
    return (
      <div id="EventsPage">
        <Switch>
          <Route
            exact
            path="/events"
            render={props => <EventsList {...this.props} />}
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
