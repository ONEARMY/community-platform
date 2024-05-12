import React, { useEffect, useState } from 'react'
import { Field } from 'react-final-form'
import { observer } from 'mobx-react'
import { Button, FieldTextarea, MapWithDraggablePin } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { MAX_PIN_LENGTH } from 'src/pages/UserSettings/constants'
import { buttons, fields, headings } from 'src/pages/UserSettings/labels'
import { randomIntFromInterval } from 'src/utils/helpers'
import { required } from 'src/utils/validators'
import { Box, Flex, Heading, Text } from 'theme-ui'

import { FlexSectionContainer } from './elements'

import type { ILocation } from 'src/models/common.models'

interface IState {
  showAddressEdit: boolean
  hasMapPin: boolean
}

interface IProps {
  toggleLocationDropdown: () => void
  children: React.ReactNode | React.ReactNode[]
}

export const MemberMapPinSection = observer(
  ({ children, toggleLocationDropdown }: IProps) => {
    const { userStore } = useCommonStores().stores
    const [state, setState] = useState<IState>({
      showAddressEdit: true,
      hasMapPin: false,
    })

    useEffect(() => {
      setState((state) => ({
        ...state,
        hasMapPin: !!userStore.user?.location?.latlng,
      }))
    }, [])

    return (
      <FlexSectionContainer>
        <Flex sx={{ justifyContent: 'space-between' }}>
          <Heading as="h2" variant="small" id="your-map-pin">
            {headings.map.title}
          </Heading>
        </Flex>

        {children}

        <Box>
          <Text mt={4} mb={4} sx={{ display: 'block' }}>
            {headings.map.description}
          </Text>

          {!state.hasMapPin && (
            <>
              <Button
                data-cy="add-a-map-pin"
                onClick={() => {
                  toggleLocationDropdown()
                  setState((state) => ({
                    ...state,
                    hasMapPin: !state.hasMapPin,
                  }))
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

          {state.hasMapPin && (
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
                showCharacterCount
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
                            toggleLocationDropdown()
                            setState((state) => ({
                              ...state,
                              hasMapPin: false,
                            }))
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
  },
)
