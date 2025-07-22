import { useEffect, useMemo, useRef, useState } from 'react'
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
  ModerationRecord,
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
import { isProfileComplete } from 'src/utils/isProfileComplete'
import { Alert, Card, Flex, Heading, Text } from 'theme-ui'

import { createMarkerIcon } from '../Maps/Content/MapView/Sprites'
import { mapPinService } from '../Maps/map.service'
import { SettingsFormNotifications } from './content/SettingsFormNotifications'

import type { DivIcon } from 'leaflet'
import type { ILatLng, MapPin } from 'oa-shared'
import type { Map } from 'react-leaflet'
import type { IFormNotification } from './content/SettingsFormNotifications'

const LocationDataTextDisplay = ({ pin }: { pin?: MapPin }) => {
  const navigate = useNavigate()

  if (!pin)
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
        <Flex sx={{ gap: 1 }}>
          {pin.name}
          <FlagIconEvents
            countryCode={pin.countryCode}
            title={pin.countryCode}
          />
        </Flex>
      </Text>
      {pin.moderation !== 'accepted' ? (
        <>
          <Alert variant="warning" sx={{ gap: 1 }}>
            <Text sx={{ fontSize: 1 }}>
              Your pin status is {ModerationRecord[pin.moderation]}
            </Text>
            {pin.moderationFeedback && (
              <>
                {' - '}
                <Text sx={{ fontSize: 1 }}>
                  Moderator feedback:{' '}
                  <Text sx={{ fontWeight: 'bold' }}>
                    {pin.moderationFeedback}
                  </Text>
                </Text>
              </>
            )}
          </Alert>
        </>
      ) : (
        <Button
          onClick={() => navigate(`/map#${pin.profile!.username}`)}
          sx={{ alignSelf: 'flex-start' }}
          icon="map"
          variant="secondary"
        >
          See your pin on the map
        </Button>
      )}
    </>
  )
}

export const SettingsPageMapPin = () => {
  const communityProgramUrl =
    import.meta.env.VITE_COMMUNITY_PROGRAM_URL ||
    process.env.VITE_COMMUNITY_PROGRAM_URL
  const [mapPin, setMapPin] = useState<MapPin | undefined>()
  const [markerIcon, setMarkerIcon] = useState<DivIcon>()
  const [isLoading, setIsLoading] = useState(true)
  const [notification, setNotification] = useState<
    IFormNotification | undefined
  >(undefined)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const newMapRef = useRef<Map>(null)

  const { profile } = useProfileStore()

  const isMember = profile?.type === ProfileTypeList.MEMBER
  const { addPinTitle, yourPinTitle } = headings.map
  const formId = 'MapSection'

  const initialValues = useMemo<{ location: ILatLng | null }>(() => {
    if (!mapPin) {
      return { location: null }
    }
    return {
      location: {
        lat: mapPin?.lat,
        lng: mapPin?.lng,
      },
    }
  }, [mapPin])

  useEffect(() => {
    const init = async () => {
      if (!profile) {
        return
      }

      const pin = await mapPinService.getMapPinById(profile.id)

      if (pin) {
        setMapPin(pin)
        setMarkerIcon(createMarkerIcon(pin, true))
      }
      setIsLoading(false)
    }

    init()
  }, [profile, notification])

  const onSubmit = async (obj: { location: ILatLng }) => {
    setIsLoading(true)

    try {
      const pinData = await getLocationData(obj.location)
      const newPin = await profileService.upsertPin(pinData)
      setMapPin(newPin)

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

  const onSubmitDelete = async () => {
    setIsLoading(true)
    try {
      await profileService.deletePin()
      setMapPin(undefined)

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

  if (!profile) {
    return null
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

        {!isMember && mapPin?.moderation !== 'accepted' && (
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

      {isProfileComplete(profile) ? (
        <Form
          id={formId}
          onSubmit={onSubmit}
          initialValues={initialValues}
          render={({
            values,
            errors,
            submitFailed,
            submitting,
            handleSubmit,
          }) => {
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

                <LocationDataTextDisplay pin={mapPin} />

                <Field
                  name="location"
                  render={({ input }) => {
                    const { onChange, value } = input

                    return (
                      <MapWithPin
                        mapRef={newMapRef}
                        position={{ lat: value.lat, lng: value.lng }}
                        updatePosition={(newPosition: ILatLng) =>
                          onChange(newPosition)
                        }
                        markerIcon={markerIcon}
                        zoom={2}
                        center={[0, 0]}
                      />
                    )
                  }}
                />

                {values.location && (
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
                )}
                {mapPin && (
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
                )}
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
