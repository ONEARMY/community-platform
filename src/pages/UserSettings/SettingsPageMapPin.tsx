import { useEffect, useMemo, useRef, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { Link, useNavigate } from 'react-router';
import { observer } from 'mobx-react';
import {
  Button,
  ConfirmModal,
  FlagIcon,
  Icon,
  Loader,
  MapWithPin,
  ModerationRecord,
} from 'oa-components';
import { buttons, headings, inCompleteProfile, mapForm } from 'src/pages/UserSettings/labels';
import { profileService } from 'src/services/profileService';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { getLocationData } from 'src/utils/getLocationData';
import { Alert, Card, Flex, Heading, Text } from 'theme-ui';

import { createMarkerIcon } from '../Maps/Content/MapView/Sprites';
import { mapPinService } from '../Maps/map.service';
import { SettingsFormNotifications } from './content/SettingsFormNotifications';

import type { DivIcon } from 'leaflet';
import type { ILatLng, MapPin } from 'oa-shared';
import type { Map } from 'react-leaflet';
import type { IFormNotification } from './content/SettingsFormNotifications';

export const SettingsPageMapPin = observer(() => {
  const [mapPin, setMapPin] = useState<MapPin | undefined>();
  const [previewMapPin, setPreviewMapPin] = useState<MapPin | undefined>();
  const [markerIcon, setMarkerIcon] = useState<DivIcon>();
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<IFormNotification | undefined>(undefined);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const newMapRef = useRef<Map>(null);
  const navigate = useNavigate();

  const { profile, isComplete } = useProfileStore();

  const isMember = !profile?.type?.isSpace;
  const { addPinTitle, yourPinTitle } = headings.map;
  const formId = 'MapSection';

  const initialValues = useMemo<{ location: ILatLng | null }>(() => {
    if (!mapPin) {
      return { location: null };
    }
    return {
      location: {
        lat: mapPin?.lat,
        lng: mapPin?.lng,
      },
    };
  }, [mapPin]);

  useEffect(() => {
    const init = async () => {
      const pin = await mapPinService.getCurrentUserMapPin();

      if (pin) {
        setMapPin(pin);
        setMarkerIcon(createMarkerIcon(pin, true));
      }
      setIsLoading(false);
    };

    init();
  }, []);

  const onSubmit = async (obj: { location: ILatLng }) => {
    setIsLoading(true);

    try {
      const pinData = await getLocationData(obj.location);
      const newPin = await profileService.upsertPin(pinData);
      setMapPin(newPin);
      setPreviewMapPin(undefined);

      setNotification({
        message: mapForm.successfulSave,
        icon: 'check',
        show: true,
        variant: 'success',
      });
    } catch (error) {
      setNotification({
        message: `Save Failed - ${error.message} `,
        icon: 'close',
        show: true,
        variant: 'failure',
      });
    }
    setIsLoading(false);
  };

  const onSubmitDelete = async () => {
    setIsLoading(true);
    try {
      await profileService.deletePin();
      setMapPin(undefined);

      setNotification({
        message: mapForm.successfulDelete,
        icon: 'check',
        show: true,
        variant: 'success',
      });
    } catch (error) {
      setNotification({
        message: `Delete failed - ${error.message} `,
        icon: 'close',
        show: true,
        variant: 'failure',
      });
    }
    setIsLoading(false);
  };

  if (!profile) {
    return null;
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
          <Text variant="quiet" data-cy="descriptionMember" data-testid="descriptionMember">
            {mapForm.descriptionMember}
          </Text>
        )}

        {!isMember && mapPin?.moderation !== 'accepted' && (
          <Text variant="quiet" data-cy="descriptionSpace" data-testid="descriptionSpace">
            {mapForm.descriptionSpace}
          </Text>
        )}
      </Flex>

      {isComplete ? (
        <Form
          id={formId}
          onSubmit={onSubmit}
          initialValues={initialValues}
          render={({ values, errors, submitFailed, submitting, handleSubmit }) => {
            if (isLoading) return <Loader label={mapForm.loading} sx={{ alignSelf: 'center' }} />;

            return (
              <>
                <SettingsFormNotifications
                  errors={errors}
                  notification={notification}
                  submitFailed={submitFailed}
                />

                {!mapPin && (
                  <Text
                    variant="paragraph"
                    sx={{ fontStyle: 'italic' }}
                    data-cy="NoLocationDataTextDisplay"
                    data-testid="NoLocationDataTextDisplay"
                  >
                    {mapForm.noLocationLabel}
                  </Text>
                )}

                {mapPin && mapPin.moderation !== 'accepted' && (
                  <Alert variant="warning" sx={{ gap: 1 }}>
                    <Text sx={{ fontSize: 1 }}>
                      Your pin status is {ModerationRecord[mapPin.moderation].toLowerCase()}
                    </Text>
                    {mapPin.moderationFeedback && (
                      <>
                        {' - '}
                        <Text sx={{ fontSize: 1 }}>
                          Moderator feedback:{' '}
                          <Text sx={{ fontWeight: 'bold' }}>{mapPin.moderationFeedback}</Text>
                        </Text>
                      </>
                    )}
                  </Alert>
                )}

                <Field
                  name="location"
                  render={({ input }) => {
                    const { onChange, value } = input;

                    return (
                      <MapWithPin
                        mapRef={newMapRef}
                        position={{ lat: value.lat, lng: value.lng }}
                        updatePosition={async (newPosition: ILatLng) => {
                          onChange(newPosition);
                          const data = await getLocationData(newPosition);
                          const previewPin = {
                            ...data,
                            lat: newPosition.lat,
                            lng: newPosition.lng,
                            moderation: 'accepted',
                            profile: profile as any,
                          } as MapPin;
                          setPreviewMapPin(previewPin);
                        }}
                        markerIcon={markerIcon}
                        zoom={2}
                        center={[0, 0]}
                      />
                    );
                  }}
                />

                <Flex sx={{ flexDirection: 'column', gap: 1 }}>
                  {mapPin && (
                    <Flex
                      sx={{ gap: 1 }}
                      variant="paragraph"
                      data-cy="LocationDataTextDisplay"
                      data-testid="LocationDataTextDisplay"
                    >
                      {mapForm.locationLabel}
                      <Flex sx={{ gap: 1, alignItems: 'center' }}>
                        <FlagIcon countryCode={mapPin.countryCode} />
                        {mapPin.name}
                      </Flex>
                    </Flex>
                  )}

                  {previewMapPin && (
                    <Flex sx={{ gap: 1 }}>
                      <Text variant="paragraph">Your updated map pin:</Text>
                      <Text
                        variant="paragraph"
                        data-cy="LocationDataTextDisplay"
                        data-testid="LocationDataTextDisplay"
                      >
                        <Flex sx={{ gap: 1, alignItems: 'center' }}>
                          <FlagIcon countryCode={previewMapPin.countryCode} />
                          {previewMapPin.name ||
                            previewMapPin.administrative ||
                            previewMapPin.country}
                        </Flex>
                      </Text>
                    </Flex>
                  )}
                </Flex>

                <Flex sx={{ gap: 2 }}>
                  <Button
                    type="submit"
                    form={formId}
                    data-cy="save-map-pin"
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={!values.location || submitting}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    {buttons.editPin}
                  </Button>

                  {mapPin && (
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
                  )}

                  {mapPin?.moderation === 'accepted' && (
                    <Button
                      onClick={() => navigate(`/map#${mapPin.profile!.username}`)}
                      sx={{ alignSelf: 'flex-start' }}
                      icon="map"
                      variant="secondary"
                    >
                      See your pin on the map
                    </Button>
                  )}
                </Flex>

                {mapPin && (
                  <ConfirmModal
                    isOpen={showConfirmModal}
                    message={mapForm.confirmDeletePin}
                    confirmButtonText={buttons.removePin}
                    handleCancel={() => setShowConfirmModal(false)}
                    handleConfirm={onSubmitDelete}
                    width={450}
                  />
                )}
              </>
            );
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
  );
});
