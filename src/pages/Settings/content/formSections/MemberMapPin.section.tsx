import * as React from 'react'
import { observer, inject } from 'mobx-react'
import Heading from 'src/components/Heading'
import { Field } from 'react-final-form'
import Text from 'src/components/Text'
import { Button } from 'oa-components'
import { TextAreaField } from 'src/components/Form/Fields'
import { Box, Flex } from 'rebass'
import { FlexSectionContainer, ArrowIsSectionOpen } from './elements'
import { MAP_GROUPINGS } from 'src/stores/Maps/maps.groupings'
import theme from 'src/themes/styled.theme'
import { required } from 'src/utils/validators'
import { ILocation } from 'src/models/common.models'
import MapWithDraggablePin from 'src/components/MapWithDraggablePin/MapWithDraggablePin'
import type { UserStore } from 'src/stores/User/user.store'
import { randomIntFromInterval } from 'src/utils/helpers'

interface IState {
  showAddressEdit: boolean
  hasMapPin: boolean
  isOpen?: boolean
}

@inject('mapsStore', 'userStore')
@observer
export class MemberMapPinSection extends React.Component<any, IState> {
  pinFilters = MAP_GROUPINGS
  constructor(props) {
    super(props)
    this.state = {
      showAddressEdit: true,
      isOpen: true,
      hasMapPin: false,
    }
  }

  get injected() {
    return this.props as {
      userStore: UserStore,
    }
  }

  componentDidMount() {
    this.setState({
      hasMapPin: !!this.injected.userStore.user?.location?.latlng
    })
  }

  render() {
    const { isOpen } = this.state


    return (
      <FlexSectionContainer>
        <Flex justifyContent="space-between">
          <Heading small id="your-map-pin">
            Add yourself to the map!
          </Heading>
          <ArrowIsSectionOpen
            onClick={() => {
              this.setState({ isOpen: !isOpen })
            }}
            isOpen={isOpen}
          />
        </Flex>

        <Box sx={{ display: isOpen ? 'block' : 'none' }}>
          <Text regular my={4}>
            Add yourself to the map as an individual who wants to get started.
            Find local community members and meetup to join forces and
            collaborate.
          </Text>

          {!this.state.hasMapPin && (
            <>
              <Button
                data-cy="add-a-map-pin"
                onClick={() => {
                  this.setState({ hasMapPin: !this.state.hasMapPin })
                }}
              >
                Add a map pin
              </Button>

              <Field type="hidden"
                name={'location'}
                render={()=>{
                  return ('');
                }}
              ></Field>
            </>
          )}

          {this.state.hasMapPin && (
            <>
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
                  const defaultLocation = {
                    latlng: {
                      lat: randomIntFromInterval(-90, 90),
                      lng: randomIntFromInterval(-180, 180),
                    },
                  }
                  const location: ILocation = value && value.latlng ? value : defaultLocation
                  return (
                    <>
                      <Box>
                        <Text mb={2} mt={4} medium>
                          Your location
                        </Text>
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

                        <Button mt={4} variant="outline"
                          onClick={() => {
                            this.setState({
                              hasMapPin: false,
                            })
                            props.input.onChange({
                              latlng: null,
                            });
                          }}>Remove map pin</Button>
                      </Box>
                    </>
                  )
                }}
              />
            </>
          )}
        </Box>
      </FlexSectionContainer>
    )
  }
}
