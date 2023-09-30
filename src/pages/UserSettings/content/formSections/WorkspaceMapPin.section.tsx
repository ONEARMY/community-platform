import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { Heading, Box, Flex, Text, Alert } from 'theme-ui'
import { Field } from 'react-final-form'
import { ExternalLink, FieldTextarea, MapWithDraggablePin } from 'oa-components'

import { FlexSectionContainer } from './elements'
import { MAP_GROUPINGS } from 'src/stores/Maps/maps.groupings'
import { required } from 'src/utils/validators'
import { randomIntFromInterval } from 'src/utils/helpers'
import { MAX_PIN_LENGTH } from 'src/pages/UserSettings/constants'
import { fields, headings } from 'src/pages/UserSettings/labels'

import type { ThemeStore } from 'src/stores/Theme/theme.store'
import type { ILocation } from 'src/models/common.models'

@inject('themeStore')
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
    const { location, mapPinDescription } = fields
    const { description, title } = headings.workspace

    return (
      <FlexSectionContainer>
        <Flex sx={{ justifyContent: 'space-between' }}>
          <Heading variant="small" id="your-map-pin">
            {title}
          </Heading>
        </Flex>
        {this.props.children}
        <Alert sx={{ fontSize: 2, textAlign: 'left', my: 2 }} variant="failure">
          <Box>
            <ExternalLink
              href={
                this.injected.themeStore?.currentTheme.styles
                  .communityProgramURL
              }
              sx={{ textDecoration: 'underline', color: 'currentcolor' }}
            >
              {description}
            </ExternalLink>
          </Box>
        </Alert>
        <Box>
          <Text mb={2} sx={{ fontSize: 2, display: 'block' }}>
            {`${mapPinDescription.title} *`}
          </Text>
          <Field
            data-cy="pin-description"
            name="mapPinDescription"
            component={FieldTextarea}
            maxLength={MAX_PIN_LENGTH}
            style={{ height: 'inherit' }}
            rows="1"
            placeholder={mapPinDescription.placeholder}
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
              const locationData: ILocation = value?.latlng
                ? value
                : defaultLocation
              return (
                <>
                  <Box>
                    <Text mb={2} mt={4} sx={{ fontSize: 2, display: 'block' }}>
                      {location.title}
                    </Text>
                    {props.meta.invalid && (
                      <Text mb="5px" sx={{ fontSize: 1, color: 'red' }}>
                        {location.error}
                      </Text>
                    )}

                    <MapWithDraggablePin
                      position={locationData.latlng}
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
