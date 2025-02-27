import { useEffect, useRef, useState } from 'react'
import { Field, Form } from 'react-final-form'
import { useNavigate } from 'react-router'
import { Link } from '@remix-run/react'
import { toJS } from 'mobx'
import {
  Button,
  ConfirmModal,
  ExternalLink,
  FlagIconEvents,
  Icon,
  Loader,
  MapWithPin,
} from 'oa-components'
import { IModerationStatus, ProfileTypeList } from 'oa-shared'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import {
  buttons,
  headings,
  inCompleteProfile,
  mapForm,
} from 'src/pages/UserSettings/labels'
import { randomIntFromInterval } from 'src/utils/helpers'
import { isProfileComplete } from 'src/utils/isProfileComplete'
import { Alert, Box, Flex, Heading, Text } from 'theme-ui'

import { createMarkerIcon } from '../Maps/Content/MapView/Sprites'
import { SettingsFormNotifications } from './content/SettingsFormNotifications'

import type { DivIcon } from 'leaflet'
import type { ILatLng, ILocation, IMapPin, IUserDB } from 'oa-shared'
import type { Map } from 'react-leaflet'
import type { IFormNotification } from './content/SettingsFormNotifications'

interface IPinProps {
  mapPin: IMapPin | undefined
}

const LocationDataTextDisplay = ({ user }: { user: IUserDB }) => {
  const { _id, location } = user
  const navigate = useNavigate()

  if (!location?.latlng)
    return (
      <Text
        variant="paragraph"
        data-cy="NoLocationDataTextDisplay"
        data-testid="NoLocationDataTextDisplay"
      >
        {mapForm.noLocationLabel}
      </Text>
    )

  return (
    <>
      <Text
        variant="paragraph"
        data-cy="LocationDataTextDisplay"
        data-testid="LocationDataTextDisplay"
      >
        {mapForm.locationLabel}
        <br />
        {location?.name}{' '}
        <FlagIconEvents
          countryCode={location.countryCode}
          title={location.countryCode}
        />
        <br />
      </Text>
      <Button
        onClick={() => navigate(`/map#${_id}`)}
        sx={{ alignSelf: 'flex-start' }}
        icon="map"
        variant="secondary"
      >
        See your pin on the map
      </Button>
    </>
  )
}

const MapPinModerationComments = ({ mapPin }: IPinProps) => {
  if (
    !mapPin ||
    !mapPin.comments ||
    mapPin.moderation != IModerationStatus.IMPROVEMENTS_NEEDED
  )
    return null

  return (
    <Alert variant="info" sx={{ fontSize: 2, textAlign: 'left' }}>
      <Box>
        {mapForm.needsChanges}
        <br />
        <em>{mapPin?.comments}</em>
      </Box>
    </Alert>
  )
}

interface IPropsDeletePin {
  setIsLoading: (arg: boolean) => void
  setNotification: (arg: IFormNotification) => void
  user: IUserDB
}

const DeleteMapPin = (props: IPropsDeletePin) => {
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false)
  const { setIsLoading, setNotification, user } = props
  const { mapsStore, userStore } = useCommonStores().stores

  const onSubmitDelete = async () => {
    setIsLoading(true)
    try {
      const updatedUser = await userStore.deleteUserLocation(user)
      if (updatedUser) {
        await mapsStore.deleteUserPin(toJS(updatedUser))
      }
      setNotification({
        message: mapForm.sucessfulDelete,
        icon: 'check',
        show: true,
        variant: 'success',
      })
    } catch (error) {
      setNotification({
        message: `Delete failed - ${error.message} `,
        icon: 'close',
        show: true,
        variant: 'failure',
      })
    }
    setIsLoading(false)
  }

  return (
    <>
      <ConfirmModal
        isOpen={showConfirmModal}
        message={mapForm.confirmDeletePin}
        confirmButtonText={buttons.removePin}
        handleCancel={() => setShowConfirmModal(false)}
        handleConfirm={onSubmitDelete}
        width={450}
      />
      <Button
        type="button"
        onClick={() => setShowConfirmModal(true)}
        data-cy="remove-map-pin"
        variant="destructive"
        sx={{ alignSelf: 'flex-start' }}
        icon="delete"
      >
        {buttons.removePin}
      </Button>
    </>
  )
}

export const SettingsPageMapPin = () => {
  const communityProgramUrl =
    import.meta.env.VITE_COMMUNITY_PROGRAM_URL ||
    process.env.VITE_COMMUNITY_PROGRAM_URL
  const [mapPin, setMapPin] = useState<IMapPin | undefined>()
  const [markerIcon, setMarkerIcon] = useState<DivIcon>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [notification, setNotification] = useState<
    IFormNotification | undefined
  >(undefined)

  const newMapRef = useRef<Map>(null)

  const { mapsStore, userStore } = useCommonStores().stores

  const user = userStore.activeUser
  if (!user) {
    return null
  }

  const isMember = user?.profileType === ProfileTypeList.MEMBER
  const { addPinTitle, yourPinTitle } = headings.map
  const formId = 'MapSection'

  useEffect(() => {
    const init = async () => {
      if (!user) return

      const pin = await mapsStore.getPin(user.userName)

      setMapPin(pin)
      pin && setMarkerIcon(createMarkerIcon(pin, true))
      setIsLoading(false)
    }

    init()
  }, [user, notification])

  const defaultLocation = {
    latlng: {
      lat: randomIntFromInterval(-90, 90),
      lng: randomIntFromInterval(-180, 180),
    },
  }

  const onSubmit = async ({ location, mapPinDescription }) => {
    setIsLoading(true)
    try {
      const updatingUser = {
        ...user,
        location,
        mapPinDescription,
      }
      const updatedUser = await userStore.updateUserLocation(updatingUser)
      if (updatedUser) {
        const pin = toJS(updatedUser)
        await mapsStore.setUserPin(pin)
      }
      setNotification({
        message: mapForm.succesfulSave,
        icon: 'check',
        show: true,
        variant: 'success',
      })
    } catch (error) {
      setNotification({
        message: `Save Failed - ${error.message} `,
        icon: 'close',
        show: true,
        variant: 'failure',
      })
    }
    setIsLoading(false)
  }

  const initialValues = {
    location: user?.location || {},
    mapPinDescription: user.mapPinDescription || '',
  }

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 4,
      }}
    >
      <Flex sx={{ flexDirection: 'column', gap: 1 }}>
        <Heading as="h2" id="your-map-pin">
          {mapPin ? addPinTitle : yourPinTitle}
        </Heading>
        {isMember && (
          <Text
            variant="quiet"
            data-cy="descriptionMember"
            data-testid="descriptionMember"
          >
            {mapForm.descriptionMember}
          </Text>
        )}

        {!isMember && (
          <Text
            variant="quiet"
            data-cy="descriptionSpace"
            data-testid="descriptionSpace"
          >
            {mapForm.descriptionSpace}
            <br />
            <ExternalLink
              data-cy="WorkspaceMapPinRequiredStars"
              data-testid="WorkspaceMapPinRequiredStars"
              href={communityProgramUrl}
              sx={{ textDecoration: 'underline', color: 'currentcolor' }}
            >
              {headings.workspace.description}
            </ExternalLink>
          </Text>
        )}
      </Flex>

      <MapPinModerationComments mapPin={mapPin} />
      {isProfileComplete(user) ? (
        <Form
          id={formId}
          onSubmit={onSubmit}
          initialValues={initialValues}
          render={({ errors, submitFailed, submitting, handleSubmit }) => {
            if (isLoading)
              return (
                <Loader label={mapForm.loading} sx={{ alignSelf: 'center' }} />
              )

            return (
              <>
                <SettingsFormNotifications
                  errors={errors}
                  notification={notification}
                  submitFailed={submitFailed}
                />

                <LocationDataTextDisplay user={user} />

                <Field
                  name="location"
                  render={({ input }) => {
                    const { onChange, value } = input
                    const location: ILocation =
                      value && value.latlng ? value : defaultLocation

                    return (
                      <MapWithPin
                        mapRef={newMapRef}
                        position={location.latlng}
                        updatePosition={(newPosition: ILatLng) => {
                          onChange({ latlng: newPosition })
                        }}
                        markerIcon={markerIcon}
                        zoom={2}
                        center={[0, 0]}
                      />
                    )
                  }}
                />

                <Button
                  type="submit"
                  form={formId}
                  data-cy="save-map-pin"
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={submitting}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  {buttons.editPin}
                </Button>

                <DeleteMapPin
                  setIsLoading={setIsLoading}
                  setNotification={setNotification}
                  user={user}
                />
              </>
            )
          }}
        />
      ) : (
        <Alert
          variant="info"
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            alignItems: 'flex-start',
          }}
        >
          <Text
            variant="paragraph"
            data-cy="IncompleteProfileTextDisplay"
            data-testid="IncompleteProfileTextDisplay"
            sx={{ fontSize: 1 }}
          >
            {inCompleteProfile}
          </Text>
          <Link
            to="/settings"
            data-testid="complete-profile-button"
            data-cy="complete-profile-button"
          >
            <Button
              type="button"
              variant="secondary"
              data-cy="mapPinPage"
              backgroundColor="white"
              sx={{ borderRadius: 3 }}
            >
              <Flex sx={{ gap: 2 }}>
                <Icon glyph={'profile'} size={20} />
                <Text variant="paragraph">Complete your profile</Text>
              </Flex>
            </Button>
          </Link>
        </Alert>
      )}
    </Flex>
  )
}
