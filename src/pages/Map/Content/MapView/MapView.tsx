import * as React from 'react'
import { IMapPin } from 'src/models/map.model'
import Heading from 'src/components/Heading'
import { Map, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { BoxContainer } from 'src/components/Layout/BoxContainer'
import Text from 'src/components/Text'
import { FlexContainer } from 'src/components/Layout/FlexContainer'

interface IState {
  lat: number
  lng: number
  zoom: number
}

interface IProps {
  mapPins: IMapPin[]
}

const customMarker = L.icon({
  iconUrl: require('./map-marker.png'),
  iconSize: [40, 56],
  iconAnchor: [20, 56],
})

export class MapView extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      lat: 51.4416,
      lng: 5.4697,
      zoom: 5,
    }
  }

  public render() {
    const { mapPins } = this.props
    const { lat, lng, zoom } = this.state
    return (
      <FlexContainer flexDirection="column" style={{ height: '100%' }}>
        <Heading>Map View</Heading>
        <Map
          center={[lat, lng]}
          zoom={zoom}
          zoomControl={false}
          style={{ flex: 1 }}
        >
          <ZoomControl position="topright" />
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mapPins.map(pin => (
            <Marker
              icon={customMarker}
              position={[pin.location.lat, pin.location.lng]}
              // set pin_id as key so react can track render changes
              key={pin._id}
            >
              <Popup maxWidth={225} minWidth={225}>
                {/* BoxContainer and Text are basically just custom styled divs */}
                <BoxContainer>
                  <Text>by {pin._createdBy}</Text>
                </BoxContainer>
              </Popup>
            </Marker>
          ))}
        </Map>
      </FlexContainer>
    )
  }
}
