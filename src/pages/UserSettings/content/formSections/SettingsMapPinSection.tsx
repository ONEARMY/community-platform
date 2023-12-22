import React, { useEffect, useState } from 'react'
import { Field } from 'react-final-form'
import { observer } from 'mobx-react'
import { Button, FieldTextarea, MapWithPin } from 'oa-components'
import MapPinPreviewImage from 'src/assets/images/settings/map-pin-preview.png'
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

export const SettingsMapPinSection = observer(
  ({ children, toggleLocationDropdown }: IProps) => {
    const { userStore } = useCommonStores().stores
    const [state, setState] = useState<IState>({
      showAddressEdit: false,
      hasMapPin: false,
    })

    const { addPinTitle, yourPinTitle } = headings.map

    useEffect(() => {
      setState((state) => ({
        ...state,
        hasMapPin: !!userStore.user?.location?.latlng,
      }))
    }, [])

    return (
      <FlexSectionContainer>
        <Flex sx={{ justifyContent: 'space-between' }}>
          <Heading variant="small" id="your-map-pin">
            {state.hasMapPin && !state.showAddressEdit
              ? addPinTitle
              : yourPinTitle}
          </Heading>
        </Flex>

        {children}

        <Box>
          {!state.hasMapPin && (
            <Flex
              sx={{
                flexDirection: ['column', 'row'],
                justifyContent: 'space-between',
              }}
            >
              <Text
                sx={{
                  display: 'block',
                  flex: 2,
                  marginTop: 4,
                  marginBottom: 4,
                }}
              >
                {headings.map.description}
              </Text>
              <Box sx={{ flex: 1 }}>
                <img
                  style={{ width: '100%' }}
                  src={MapPinPreviewImage}
                  alt="Map pin preview"
                />
              </Box>
            </Flex>
          )}

          {!state.hasMapPin && (
            <>
              <Button
                data-cy="add-a-map-pin"
                onClick={() => {
                  toggleLocationDropdown()
                  setState((state) => ({
                    ...state,
                    hasMapPin: !state.hasMapPin,
                    showAddressEdit: true,
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

          {state.hasMapPin && !state.showAddressEdit && (
            <>
              <Text mt={4} mb={2} sx={{ display: 'block', flex: '2' }}>
                {headings.map.existingPinLabel}
              </Text>
              <Field
                disabled={true}
                mb={4}
                data-cy="pin-description"
                name="mapPinDescription"
                component={FieldTextarea}
                maxLength={MAX_PIN_LENGTH}
                style={{ height: 'inherit' }}
                rows="1"
                showCharacterCount
                validate={required}
                validateFields={[]}
                value={userStore.user?.mapPinDescription}
              />

              <MapWithPin
                position={
                  userStore.user?.location?.latlng || { lat: 0, lng: 0 }
                }
                draggable={false}
              />

              <Button
                mr={2}
                data-cy="edit-map-pin"
                onClick={() => {
                  setState((state) => ({
                    ...state,
                    showAddressEdit: true,
                  }))
                }}
              >
                {buttons.editPin}
              </Button>

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
                }}
              >
                {buttons.removePin}
              </Button>
            </>
          )}

          {state.hasMapPin && state.showAddressEdit && (
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

                        <MapWithPin
                          position={location.latlng}
                          draggable={true}
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
