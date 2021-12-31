import * as React from 'react'
import { observer, inject } from 'mobx-react'
import Heading from 'src/components/Heading'
import { Field } from 'react-final-form'
import Text from 'src/components/Text'
import { TextAreaField } from 'src/components/Form/Fields'
import { Box, Flex, Link } from 'rebass/styled-components'
import { FlexSectionContainer, ArrowIsSectionOpen } from './elements'
import 'leaflet/dist/leaflet.css'
import { Button } from 'src/components/Button'
import { MAP_GROUPINGS } from 'src/stores/Maps/maps.groupings'
import theme from 'src/themes/styled.theme'
import { required } from 'src/utils/validators'
import { LocationSearch } from 'src/components/LocationSearch/LocationSearch'
import { ILocation } from 'src/models/common.models'
import MapWithDraggablePin from 'src/components/MapWithDraggablePin/MapWithDraggablePin'

interface IState {
  showAddressEdit: boolean
  isOpen?: boolean
}

@inject('mapsStore', 'userStore')
@observer
export class UserMapPinSection extends React.Component<any, IState> {
  pinFilters = MAP_GROUPINGS
  constructor(props) {
    super(props)
    this.state = {
      showAddressEdit: true,
      isOpen: true,
    }
  }

  render() {
    const { showAddressEdit, isOpen } = this.state

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
        <Box bg={theme.colors.red2} mt={2} p={3} sx={{ borderRadius: '3px' }}>
          <Text medium>
            In order to have your pin accepted on our map you have to collect at
            least 6 stars in the Ally Checklist. Learn more about the{' '}
            <Link
              href="https://community.preciousplastic.com/academy/guides/community-program"
              target="_blank"
              sx={{ color: 'black', textDecoration: 'underline' }}
            >
              Community Program
            </Link>{' '}
            and how you can join.
          </Text>
        </Box>
        <Box sx={{ display: isOpen ? 'block' : 'none' }}>
          <Text mb={2} mt={4} medium>
            Short description of your pin*
          </Text>
          <Field
            data-cy="pin-description"
            name="mapPinDescription"
            component={TextAreaField}
            maxLength="70"
            style={{ height: 'inherit' }}
            rows="1"
            placeholder="Short description of your pin (max 70 characters)"
            validate={required}
            validateFields={[]}
          />
          <Field
            name={'location'}
            render={props => {
              const { value } = props.input
              const defaultLocation = { latlng: { lat: 0, lng: 0 } }
              const location: ILocation = value ? value : defaultLocation
              return (
                <>
                  {showAddressEdit ? (
                    <Box>
                      <Text mb={2} mt={4} medium>
                        Your workspace address *
                      </Text>
                      <LocationSearch
                        trackingCategory="Map Pin"
                        onChange={v => {
                          props.input.onChange(v)
                          props.input.onBlur()
                        }}
                      />
                      {props.meta.invalid && (
                        <Text small color={theme.colors.red} mb="5px">
                          Please select your location
                        </Text>
                      )}
                      <MapWithDraggablePin
                        position={location.latlng}
                        updatePosition={newPosition => {
                          props.input.onChange({
                            latlng: newPosition,
                          })
                        }}
                      />
                    </Box>
                  ) : (
                    <Box>
                      <Text mb={2} mt={4} medium>
                        Your workspace address is :
                      </Text>
                      <Text mb={2} my={4} medium data-cy="location-value">
                        {location.value}
                      </Text>
                      <Button
                        variant="secondary"
                        onClick={() => this.setState({ showAddressEdit: true })}
                        data-cy="change-address"
                      >
                        Change address
                      </Button>
                    </Box>
                  )}
                </>
              )
            }}
          />
        </Box>
      </FlexSectionContainer>
    )
  }
}
