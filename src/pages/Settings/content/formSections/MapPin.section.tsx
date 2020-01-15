import * as React from 'react'
import { observer, inject } from 'mobx-react'
import Heading from 'src/components/Heading'
import { Field } from 'react-final-form'
import Text from 'src/components/Text'
import { TextAreaField } from 'src/components/Form/Fields'
import { Box, Flex, Link } from 'rebass'
import { FlexSectionContainer, ArrowIsSectionOpen } from './elements'
import { Map, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LocationSearchField } from 'src/components/Form/LocationSearch.field'
import { IUserPP } from 'src/models/user_pp.models'
import { Button } from 'src/components/Button'
import { ILocation } from 'src/models/common.models'
import { MAP_GROUPINGS } from 'src/stores/Maps/maps.groupings'
import theme from 'src/themes/styled.theme'
import { IFormValues } from '../../SettingsPage'
import { required } from 'src/utils/validators'

interface IProps {
  initialFormValues: IFormValues
  onInputChange: (v: ILocation) => void
  showSubmitErrors: boolean
}
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

@inject('mapsStore', 'userStore')
@observer
export class UserMapPinSection extends React.Component<IProps, IState> {
  pinFilters = MAP_GROUPINGS
  constructor(props: IProps) {
    super(props)
    this.state = {
      editAddress: false,
      lat:
        props.initialFormValues && props.initialFormValues.location
          ? props.initialFormValues.location.latlng.lat
          : 0,
      lng:
        props.initialFormValues && props.initialFormValues.location
          ? props.initialFormValues.location.latlng.lng
          : 0,
      zoom:
        props.initialFormValues && props.initialFormValues.location ? 15 : 1.5,
      isOpen: true,
    }
  }

  render() {
    const { initialFormValues, showSubmitErrors } = this.props
    const { lat, lng, zoom, editAddress, isOpen } = this.state

    return (
      <FlexSectionContainer>
        <Flex justifyContent="space-between">
          <Heading small id="your-map-pin">
            Your map pin
          </Heading>
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
          {!initialFormValues.location || editAddress ? (
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
              />
              {showSubmitErrors && (
                <Text small color={theme.colors.red} mb="5px">
                  Please select your location
                </Text>
              )}

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
                    This adress will be shown on the map
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
                {initialFormValues.location.value}
              </Text>
              <Button
                variant="secondary"
                onClick={() => this.setState({ editAddress: !editAddress })}
                data-cy="change-address"
              >
                Change address
              </Button>
            </Box>
          )}
          <Box
            bg={theme.colors.softblue}
            mt={2}
            p={2}
            sx={{ borderRadius: '3px' }}
          >
            <Text small>
              We are aware that location search may result in an inaccurate
              position of your pin. If it happend, choose the closest location
              to you. Pro tip : you can write your precise address in your
              profile description & help find a fix{' '}
              <Link
                href="https://github.com/ONEARMY/community-platform/issues/739"
                target="_blank"
                sx={{ color: 'black', textDecoration: 'underline' }}
              >
                here.
              </Link>
            </Text>
          </Box>
        </Box>
      </FlexSectionContainer>
    )
  }
}
