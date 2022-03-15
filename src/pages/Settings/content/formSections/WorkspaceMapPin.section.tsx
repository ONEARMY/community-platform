import * as React from 'react'
import { observer, inject } from 'mobx-react'
import Heading from 'src/components/Heading'
import { Field } from 'react-final-form'
import Text from 'src/components/Text'
import { TextAreaField } from 'src/components/Form/Fields'
import { Box, Flex, Link } from 'rebass'
import { FlexSectionContainer, ArrowIsSectionOpen } from './elements'
import { MAP_GROUPINGS } from 'src/stores/Maps/maps.groupings'
import theme from 'src/themes/styled.theme'
import { required } from 'src/utils/validators'
import { ILocation } from 'src/models/common.models'
import MapWithDraggablePin from 'src/components/MapWithDraggablePin/MapWithDraggablePin'
import { randomIntFromInterval } from 'src/utils/helpers'

interface IState {
  isOpen?: boolean
}

@inject('mapsStore', 'userStore')
@observer
export class WorkspaceMapPinSection extends React.Component<any, IState> {
  pinFilters = MAP_GROUPINGS
  constructor(props) {
    super(props)
    this.state = {
      isOpen: true,
    }
  }

  render() {
    const { isOpen } = this.state

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
              const defaultLocation = {
                latlng: {
                  lat: randomIntFromInterval(-90, 90),
                  lng: randomIntFromInterval(-180, 180),
                },
              }
              const location: ILocation = value?.latlng
                ? value
                : defaultLocation
              return (
                <>
                  <Box>
                    <Text mb={2} mt={4} medium>
                      Your workspace location
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
                  </Box>
                </>
              )
            }}
          />
        </Box>
      </FlexSectionContainer>
    )
  }
}
