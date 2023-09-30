import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { Heading, Text, Box, Flex } from 'theme-ui'
import { Field } from 'react-final-form'
import { Button, FieldTextarea, MapWithDraggablePin } from 'oa-components'

import { FlexSectionContainer } from './elements'
import { MAP_GROUPINGS } from 'src/stores/Maps/maps.groupings'
import { required } from 'src/utils/validators'
import { randomIntFromInterval } from 'src/utils/helpers'
import { MAX_PIN_LENGTH } from 'src/pages/UserSettings/constants'
import { buttons, headings, fields } from 'src/pages/UserSettings/labels'

import type { ILocation } from 'src/models/common.models'
import type { UserStore } from 'src/stores/User/user.store'

interface IState {
  showAddressEdit: boolean
  hasMapPin: boolean
}

@inject('mapsStore', 'userStore')
@observer
export class MemberMapPinSection extends React.Component<any, IState> {
  pinFilters = MAP_GROUPINGS
  constructor(props) {
    super(props)
    this.state = {
      showAddressEdit: true,
      hasMapPin: false,
    }
  }

  get injected() {
    return this.props as {
      userStore: UserStore
    }
  }

  componentDidMount() {
    this.setState({
      hasMapPin: !!this.injected.userStore.user?.location?.latlng,
    })
  }

  render() {
    return (
      <FlexSectionContainer>
        <Flex sx={{ justifyContent: 'space-between' }}>
          <Heading variant="small" id="your-map-pin">
            {headings.map.title}
          </Heading>
        </Flex>

        {this.props.children}

        <Box>
          <Text mt={4} mb={4} sx={{ display: 'block' }}>
            {headings.map.description}
          </Text>

          {!this.state.hasMapPin && (
            <>
              <Button
                data-cy="add-a-map-pin"
                onClick={() => {
                  this.props.toggleLocationDropdown()
                  this.setState({ hasMapPin: !this.state.hasMapPin })
                }}
              >
                {buttons.map}
              </Button>

              <Field
                type="hidden"
                name={'location'}
                render={() => {
                  return ''
                }}
              ></Field>
            </>
          )}

          {this.state.hasMapPin && (
            <>
              <Text mb={2} mt={4} sx={{ fontSize: 2, display: 'block' }}>
                {fields.mapPinDescription.title}
              </Text>
              <Field
                data-cy="pin-description"
                name="mapPinDescription"
                component={FieldTextarea}
                maxLength={MAX_PIN_LENGTH}
                style={{ height: 'inherit' }}
                rows="1"
                placeholder={fields.mapPinDescription.placeholder}
                validate={required}
                validateFields={[]}
              />
              <Field
                name={'location'}
                render={(props) => {
                  const { value } = props.input
                  const defaultLocation = {
                    latlng: {
                      lat: randomIntFromInterval(-90, 90),
                      lng: randomIntFromInterval(-180, 180),
                    },
                  }
                  const location: ILocation =
                    value && value.latlng ? value : defaultLocation
                  return (
                    <>
                      <Box>
                        <Text
                          mb={2}
                          mt={4}
                          sx={{ fontSize: 2, display: 'block' }}
                        >
                          {fields.location.title}
                        </Text>
                        {props.meta.invalid && (
                          <Text
                            mb="5px"
                            sx={{
                              fontSize: 1,
                              color: 'red',
                            }}
                          >
                            {fields.location.error}
                          </Text>
                        )}

                        <MapWithDraggablePin
                          position={location.latlng}
                          updatePosition={(newPosition) => {
                            props.input.onChange({
                              latlng: newPosition,
                            })
                          }}
                        />

                        <Button
                          data-cy="remove-a-member-map-pin"
                          mt={4}
                          variant="outline"
                          onClick={() => {
                            this.props.toggleLocationDropdown()
                            this.setState({
                              hasMapPin: false,
                            })
                            props.input.onChange({
                              latlng: null,
                            })
                          }}
                        >
                          {buttons.removePin}
                        </Button>
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
