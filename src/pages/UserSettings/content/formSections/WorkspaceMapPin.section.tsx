import React from 'react'
import { Field } from 'react-final-form'
import { observer } from 'mobx-react'
import { ExternalLink, FieldTextarea, MapWithDraggablePin } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { MAX_PIN_LENGTH } from 'src/pages/UserSettings/constants'
import { fields, headings } from 'src/pages/UserSettings/labels'
import { randomIntFromInterval } from 'src/utils/helpers'
import { required } from 'src/utils/validators'
import { Alert, Box, Flex, Heading, Text } from 'theme-ui'

import { FlexSectionContainer } from './elements'

import type { ILocation } from 'src/models/common.models'

type IProps = {
  children: React.ReactNode | React.ReactNode[]
}

export const WorkspaceMapPinSection = observer((props: IProps) => {
  const { themeStore } = useCommonStores().stores
  const { location, mapPinDescription } = fields
  const { description, title } = headings.workspace

  return (
    <FlexSectionContainer>
      <Flex sx={{ justifyContent: 'space-between' }}>
        <Heading as="h2" variant="small" id="your-map-pin">
          {title}
        </Heading>
      </Flex>
      {props.children}
      <Alert sx={{ fontSize: 2, textAlign: 'left', my: 2 }} variant="failure">
        <Box>
          <ExternalLink
            href={themeStore?.currentTheme.styles.communityProgramURL}
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
})
