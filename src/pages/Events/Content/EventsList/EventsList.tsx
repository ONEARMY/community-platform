import * as React from 'react'
import { IEvent } from 'src/models/events.models'
import './EventsList.scss'
import * as Mocks from 'src/mocks/events.mock'
import Button from '@material-ui/core/Button'
import { ClampLines } from 'src/components/ClampLines/ClampLines'
import { EventStore } from 'src/stores/Events/events.store'

interface IState {
  events: IEvent[]
}

interface IProps {
  eventStore: EventStore
}

export class EventsList extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)
    // initial state
    this.state = { events: Mocks.EVENTS }
  }
  public formatDate(d: Date) {
    return `${Mocks.MONTHS[d.getMonth()]} ${d.getDay()}`
  }
  public showMap() {
    this.props.eventStore.setEventView('map')
  }

  public render() {
    const { events } = this.state
    return (
      <div id="EventsList">
        <div className="list-container">
          <div className="top-info-container">
            <div className="list-total">We found {events.length} events</div>
            <Button
              className="show-map view-toggle"
              variant="outlined"
              onClick={() => this.showMap()}
            >
              Show Map
            </Button>
          </div>
          {events.map((event, i) => (
            <div className="event-container" key={`event-${i}`}>
              <img className="event-image" src={event.image} />
              <div className="event-info">
                <div className="event-name">{event.name}</div>
                <div className="event-date">
                  {`${this.formatDate(event.date)} / ${event.location.city}`}
                </div>
                <div className="event-description">
                  <ClampLines text={event.description} lines={2} />
                </div>
                <div className="event-host">by {event.host}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}
