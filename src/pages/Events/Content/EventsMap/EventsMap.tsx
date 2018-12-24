import * as React from 'react'
import Button from '@material-ui/core/Button'
import { Map, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { IEvent } from 'src/models/events.models'
import * as Mocks from 'src/mocks/events.mock'
import { EventStore } from 'src/stores/Events/events.store'
import './EventsMap.scss'
import Card from '@material-ui/core/Card'
import { ClampLines } from 'src/components/ClampLines/ClampLines'

interface IState {
  events: IEvent[]
  lat: number
  lng: number
  zoom: number
}

interface IProps {
  eventStore: EventStore
}

const customMarker = L.icon({
  iconUrl: require('./map-marker.png'),
  iconSize: [40, 56],
  iconAnchor: [20, 56],
})

export class EventsMap extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)
    // initial state
    this.state = { events: Mocks.EVENTS, lat: 51.4416, lng: 5.4697, zoom: 5 }
  }
  public showList() {
    this.props.eventStore.setEventView('list')
  }

  public render() {
    const { events, lat, lng, zoom } = this.state
    return (
      <div id="EventsMap">
        <div className="top-info--floating">
          <div className="top-info-container">
            <div className="list-total">We found {events.length} events</div>
            <Button
              className="show-list view-toggle"
              variant="outlined"
              onClick={() => this.showList()}
            >
              Show List
            </Button>
          </div>
        </div>
        <div className="map-container">
          <Map center={[lat, lng]} zoom={zoom} zoomControl={false}>
            <ZoomControl position="topright" />
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {events.map(event => (
              <Marker
                icon={customMarker}
                position={[event.location.lat, event.location.lng]}
              >
                <Popup maxWidth={225} minWidth={225}>
                  <img className="popup-image" src={event.image} />
                  <div className="popup-info">
                    <div className="event-name">{event.name}</div>
                    <div className="event-date">
                      {/* {`${this.formatDate(event.date)} / ${event.location.city}`} */}
                    </div>
                    <div className="event-description">
                      <ClampLines text={event.description} lines={2} />
                    </div>
                    <div className="event-host">by {event.host}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </Map>
        </div>
      </div>
    )
  }
}
