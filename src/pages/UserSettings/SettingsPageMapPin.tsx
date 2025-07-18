import { useEffect, useRef, useState } from 'react'
import { Field, Form } from 'react-final-form'
import { useNavigate } from 'react-router'
import { Link } from '@remix-run/react'
import {
  Button,
  ConfirmModal,
  ExternalLink,
  FlagIconEvents,
  Icon,
  Loader,
  MapWithPin,
} from 'oa-components'
import { ProfileTypeList } from 'oa-shared'
import {
  buttons,
  headings,
  inCompleteProfile,
  mapForm,
} from 'src/pages/UserSettings/labels'
import { profileService } from 'src/services/profileService'
import { useProfileStore } from 'src/stores/Profile/profile.store'
import { getLocationData } from 'src/utils/getLocationData'
import { randomIntFromInterval } from 'src/utils/helpers'
import { isProfileComplete } from 'src/utils/isProfileComplete'
import { Alert, Box, Card, Flex, Heading, Text } from 'theme-ui'

import { createMarkerIcon } from '../Maps/Content/MapView/Sprites'
import { mapPinService } from '../Maps/map.service'
import { SettingsFormNotifications } from './content/SettingsFormNotifications'

import type { DivIcon } from 'leaflet'
import type { ILatLng, MapPin, Profile } from 'oa-shared'
import type { Map } from 'react-leaflet'
import type { IFormNotification } from './content/SettingsFormNotifications'

interface IPinProps {
  mapPin?: MapPin
}

const LocationDataTextDisplay = ({ user }: { user: Profile }) => {
  const navigate = useNavigate()

  if (!user.pin)
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
        {user?.displayName}{' '}
        <FlagIconEvents
          countryCode={user.pin.countryCode}
          title={user.pin.countryCode}
        />
        <br />
      </Text>
      <Button
        onClick={() => navigate(`/map#${user.username}`)}
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
    !mapPin.moderatonFeedback ||
    mapPin.moderation !== 'improvements-needed'
  ) {
    return null
  }

  return (
    <Alert variant="info" sx={{ fontSize: 2, textAlign: 'left' }}>
      <Box>
        {mapForm.needsChanges}
        <br />
        <em>{mapPin?.moderatonFeedback}</em>
      </Box>
    </Alert>
  )
}

interface IPropsDeletePin {
  setIsLoading: (arg: boolean) => void
  setNotification: (arg: IFormNotification) => void
  user: Profile
}

const DeleteMapPin = (props: IPropsDeletePin) => {
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false)
  const { setIsLoading, setNotification } = props

  const onSubmitDelete = async () => {
    setIsLoading(true)
    try {
      await profileService.deletePin()
      setNotification({
        message: mapForm.successfulDelete,
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
  const [mapPin, setMapPin] = useState<MapPin | undefined>()
  const [markerIcon, setMarkerIcon] = useState<DivIcon>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [notification, setNotification] = useState<
    IFormNotification | undefined
  >(undefined)

  const newMapRef = useRef<Map>(null)

  const { profile } = useProfileStore()

  if (!profile) {
    return null
  }

  const isMember = profile?.type === ProfileTypeList.MEMBER
  const { addPinTitle, yourPinTitle } = headings.map
  const formId = 'MapSection'

  const initialValues: ILatLng = {
    lat: profile.pin?.lat || randomIntFromInterval(-90, 90),
    lng: profile.pin?.lng || randomIntFromInterval(-180, 180),
  }

  useEffect(() => {
    const init = async () => {
      if (!profile) {
        return
      }

      const pin = await mapPinService.getMapPinByUsername(profile.username)

      if (pin) {
        setMapPin(pin)
        setMarkerIcon(createMarkerIcon(pin, true))
      }
      setIsLoading(false)
    }

    init()
  }, [profile, notification])

  const onSubmit = async ({ latLng }: { latLng: ILatLng }) => {
    setIsLoading(true)

    try {
      const pinData = await getLocationData(latLng)
      await profileService.upsertPin(pinData)

      setNotification({
        message: mapForm.successfulSave,
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
      {isProfileComplete(profile) ? (
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

                <LocationDataTextDisplay user={profile} />

                <Field
                  name="location"
                  render={({ input }) => {
                    const { onChange, value } = input

                    return (
                      <MapWithPin
                        mapRef={newMapRef}
                        position={{ lat: value.lat, lng: value.lng }}
                        updatePosition={(newPosition: ILatLng) => {
                          console.log(newPosition)
                          onChange(newPosition)
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
                  user={profile}
                />
              </>
            )
          }}
        />
      ) : (
        <Card variant="borderless" bg="#e3edf6" sx={{ borderRadius: '5px' }}>
          <Flex
            sx={{
              flexDirection: 'column',
              gap: '2',
              padding: '20px',
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
          </Flex>
        </Card>
      )}
    </Flex>
  )
}
