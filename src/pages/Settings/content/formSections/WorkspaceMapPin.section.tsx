import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { Heading, Box, Flex, Text, Alert } from 'theme-ui'
import { Field } from 'react-final-form'
import { ExternalLink, FieldTextarea, MapWithDraggablePin } from 'oa-components'
import { FlexSectionContainer } from './elements'
import { MAP_GROUPINGS } from 'src/stores/Maps/maps.groupings'
// TODO: Remove direct usage of Theme
import { preciousPlasticTheme } from 'oa-themes'
const theme = preciousPlasticTheme.styles
import { required } from 'src/utils/validators'
import type { ILocation } from 'src/models/common.models'
import { randomIntFromInterval } from 'src/utils/helpers'
import type { ThemeStore } from 'src/stores/Theme/theme.store'

@inject('mapsStore', 'userStore', 'themeStore')
@observer
export class WorkspaceMapPinSection extends React.Component<any> {
  pinFilters = MAP_GROUPINGS
  constructor(props) {
    super(props)
  }

  get injected() {
    return this.props as {
      themeStore: ThemeStore
    }
  }

  render() {
    return (
      <FlexSectionContainer>
        <Flex sx={{ justifyContent: 'space-between' }}>
          <Heading variant="small" id="your-map-pin">
            Your map pin
          </Heading>
        </Flex>
        <Alert sx={{ fontSize: 2, textAlign: 'left', my: 2 }} variant="failure">
          <Box>
            In order to have your pin accepted on our map you have to collect at
            least 6 stars in the Ally Checklist. Learn more about the{' '}
            <ExternalLink
              href={
                this.injected.themeStore?.currentTheme.styles
                  .communityProgramURL
              }
              sx={{ textDecoration: 'underline', color: 'currentcolor' }}
            >
              Community Program
            </ExternalLink>{' '}
            and how you can join.
          </Box>
        </Alert>
        <Box>
          <Text mb={2} sx={{ fontSize: 2, display: 'block' }}>
            Short description of your pin*
          </Text>
          <Field
            data-cy="pin-description"
            name="mapPinDescription"
            component={FieldTextarea}
            maxLength="70"
            style={{ height: 'inherit' }}
            rows="1"
            placeholder="Short description of your pin (max 70 characters)"
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
              const location: ILocation = value?.latlng
                ? value
                : defaultLocation
              return (
                <>
                  <Box>
                    <Text mb={2} mt={4} sx={{ fontSize: 2, display: 'block' }}>
                      Your workspace location
                    </Text>
                    {props.meta.invalid && (
                      <Text
                        color={theme.colors.red}
                        mb="5px"
                        sx={{ fontSize: 1 }}
                      >
                        Please select your location
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
