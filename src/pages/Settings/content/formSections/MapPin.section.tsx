import * as React from 'react'
import { observer, inject } from 'mobx-react'
import Heading from 'src/components/Heading'
import { Field } from 'react-final-form'
import Text from 'src/components/Text'
import { TextAreaField } from 'src/components/Form/Fields'
import { Box, Flex } from 'rebass'
import { FlexSectionContainer } from './elements'
import { MapsStore } from 'src/stores/Maps/maps.store'
import { UserStore } from 'src/stores/User/user.store'
import { Map, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { generatePinFilters } from 'src/mocks/maps.mock'
import { LocationSearchField } from 'src/components/Form/LocationSearch.field'
import { IUserPP } from 'src/models/user_pp.models'
import { Button } from 'src/components/Button'

interface IProps {
  user: IUserPP
}
// interface IInjectedProps extends IProps {
//   mapsStore: MapsStore
//   userStore: UserStore
// }
interface IState {
  editAddress: boolean
  lat: number
  lng: number
  zoom: number
}

const customMarker = L.icon({
  iconUrl: require('src/assets/icons/map-marker.png'),
  iconSize: [20, 28],
  iconAnchor: [20, 56],
})

// const DEFAULT_PIN_TYPE: string = 'member'

@inject('mapsStore', 'userStore')
@observer
export class UserMapPinSection extends React.Component<IProps, IState> {
  pinFilters = generatePinFilters()
  constructor(props: IProps) {
    super(props)
    this.state = {
      editAddress: false,
      lat: 51.4416,
      lng: 5.4697,
      zoom: 8,
    }
  }

  // update map preview and automatically save pin on location change
  // private onLocationChange(location: ILocation) {
  //   const pin = this.generateUserPin(location)
  //   this.setState({
  //     userPin: pin,
  //   })
  //   this.saveUserPin()
  // }

  // Map pin only stores a small amount of user data (id, address)
  // Rest is pulled from user profile, and kept independent of map pin datapoint
  // So that data only needs to be kept fresh in one place (i.e. not have user.location in profile)
  // private generateUserPin(location: ILocation): IMapPin {
  //   const { lat, lng } = location.latlng
  //   const address = location.value
  //   return {
  //     location: { lat, lng, address },
  //     // TODO - give proper options for pin type and pass
  //     pinType: DEFAULT_PIN_TYPE,
  //     _id: this.user._id,
  //   }
  // }

  // load existing user pin from database (used on first load)
  // private async loadUserPin() {
  //   const userPin = await this.injected.mapsStore.getPin(this.user.userName)
  //   // console.log('user pin', userPin)
  //   this.setState({ userPin })
  // }

  // convert database pin type (string) to pin with enhanced pinType meta
  // private setPinTypeMeta(pin: IMapPin): IMapPinWithType {
  //   return {
  //     ...pin,
  //     pinType: this.pinFilters.find(p => p.name === pin.pinType) as IPinType,
  //   }
  // }

  render() {
    const { user } = this.props
    const { lat, lng, zoom, editAddress } = this.state
    console.log('user pin ', user.location)

    return (
      <FlexSectionContainer>
        <Heading small>Your map pin</Heading>
        <Box id="your-map-pin">
          <Text mb={2} mt={4} medium>
            Short description of your pin *
          </Text>
          <Field
            name="mapPinDescription"
            component={TextAreaField}
            placeholder="We are shredding plastic in Plymouth, UK."
          />
          {!user.location || editAddress ? (
            <Box>
              <Text mb={2} mt={4} medium>
                Your workspace address
              </Text>
              {/* <div style={{ position: 'relative', zIndex: 2 }}>
                <LocationSearch onChange={v => this.onLocationChange(v)} />
              </div> */}
              <Field
                name={'location'}
                customChange={v =>
                  this.setState({
                    lat: v.latlng.lat,
                    lng: v.latlng.lng,
                    zoom: 15,
                  })
                }
                component={LocationSearchField}
              />

              {/* wrap both above and below in positioned div to ensure location search box appears above map
              <div style={{ height: '300px', position: 'relative', zIndex: 1 }}>
                <MapView
                  zoom={location ? 13 : 2}
                  center={location ? location.latlng : undefined}
                  pins={this.mapPins}
                  filters={this.pinFilters}
                  TODO - popup not currently shown as doesn't update correctly
                  activePinDetail={this.state.activePinDetail}
                  onPinClicked={() => this.getActivePinDetail()}
                />
              </div> */}
              <Map
                center={
                  user.location
                    ? [user.location.latlng.lat, user.location.latlng.lng]
                    : [lat, lng]
                }
                zoom={user.location ? zoom : 1.5}
                zoomControl={false}
                style={{
                  height: '300px',
                  zIndex: 1,
                }}
              >
                <ZoomControl position="topright" />
                <TileLayer
                  attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {user.location && user.location.latlng && (
                  <Marker
                    position={[
                      user.location.latlng.lat,
                      user.location.latlng.lng,
                    ]}
                    icon={customMarker}
                  >
                    <Popup maxWidth={225} minWidth={225}>
                      My adress
                    </Popup>
                  </Marker>
                )}
              </Map>
            </Box>
          ) : (
            <Flex flexWrap="nowrap">
              <Text mb={2} mt={4} medium>
                Your workspace address is :
              </Text>
              <Text mb={2} mt={4} medium>
                {user.location.value}
              </Text>
              <Button
                variant="secondary"
                onClick={() => this.setState({ editAddress: !editAddress })}
              >
                Change address
              </Button>
            </Flex>
          )}
        </Box>
      </FlexSectionContainer>
    )
  }
}
