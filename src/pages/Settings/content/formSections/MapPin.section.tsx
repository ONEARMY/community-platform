import * as React from 'react'
import { observer, inject } from 'mobx-react'
import Heading from 'src/components/Heading'
import { Field } from 'react-final-form'
import Text from 'src/components/Text'
import { TextAreaField } from 'src/components/Form/Fields'
import { Box, Flex } from 'rebass'
import { FlexSectionContainer, ArrowIsSectionOpen } from './elements'
import { Map, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LocationSearchField } from 'src/components/Form/LocationSearch.field'
import { IUserPP } from 'src/models/user_pp.models'
import { Button } from 'src/components/Button'
import { ILocation } from 'src/models/common.models'
import { MAP_GROUPINGS } from 'src/stores/Maps/maps.groupings'

interface IProps {
  user: IUserPP
  onInputChange: (v: ILocation) => void
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
  isOpen?: boolean
}

const customMarker = L.icon({
  iconUrl: require('src/assets/icons/map-marker.png'),
  iconSize: [20, 28],
  iconAnchor: [10, 28],
})

// const DEFAULT_PIN_TYPE: string = 'member'

// validation - return undefined if no error (i.e. valid)
const required = (value: any) => (value ? undefined : 'Required')

@inject('mapsStore', 'userStore')
@observer
export class UserMapPinSection extends React.Component<IProps, IState> {
  pinFilters = MAP_GROUPINGS
  constructor(props: IProps) {
    super(props)
    this.state = {
      editAddress: false,
      lat:
        props.user && props.user.location ? props.user.location.latlng.lat : 0,
      lng:
        props.user && props.user.location ? props.user.location.latlng.lng : 0,
      zoom: props.user && props.user.location ? 15 : 1.5,
      isOpen: props.user && !props.user.profileType,
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
    const { lat, lng, zoom, editAddress, isOpen } = this.state

    return (
      <FlexSectionContainer>
        <Flex justifyContent="space-between">
          <Heading small>Your map pin</Heading>
          <ArrowIsSectionOpen
            onClick={() => {
              this.setState({ isOpen: !isOpen })
            }}
            isOpen={isOpen}
          />
        </Flex>
        <Box sx={{ display: isOpen ? 'block' : 'none' }}>
          <Text mb={2} mt={4} medium>
            Short description of your pin *
          </Text>
          <Field
            data-cy="pin-description"
            name="mapPinDescription"
            component={TextAreaField}
            placeholder="We are shredding plastic in Plymouth, UK."
            validate={required}
          />
          {!user.location || editAddress ? (
            <Box>
              <Text mb={2} mt={4} medium>
                Your workspace address *
              </Text>
              <Field
                name={'location'}
                customChange={v => {
                  this.setState({
                    lat: v.latlng.lat,
                    lng: v.latlng.lng,
                    zoom: 14,
                  })
                  this.props.onInputChange(v)
                }}
                component={LocationSearchField}
                validate={required}
              />

              <Map
                center={[lat, lng]}
                zoom={zoom}
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
                <Marker position={[lat, lng]} icon={customMarker}>
                  <Popup maxWidth={225} minWidth={225}>
                    This adress will be shown on my profile
                  </Popup>
                </Marker>
              </Map>
            </Box>
          ) : (
            <Box>
              <Text mb={2} mt={4} medium>
                Your workspace address is :
              </Text>
              <Text mb={2} my={4} medium>
                {user.location.value}
              </Text>
              <Button
                variant="secondary"
                onClick={() => this.setState({ editAddress: !editAddress })}
              >
                Change address
              </Button>
            </Box>
          )}
        </Box>
      </FlexSectionContainer>
    )
  }
}
