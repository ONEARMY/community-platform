import { Button } from 'oa-components';
import type { ILatLng } from 'oa-shared';
import { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { logger } from 'src/logger';
import { GetLocation } from '../../utils/geolocation';

interface IProps {
  setCenter: (value: ILatLng) => void;
  setZoom: (value: number) => void;
}

const ZOOM_IN_TOOLTIP = 'Zoom in to your location';
const DENIED_TOOLTIP = 'Request to get your location already denied';

export const ButtonZoomIn = ({ setCenter, setZoom }: IProps) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  useEffect(() => {
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'denied') {
        setIsDisabled(true);
      }
    });
  }, []);

  const promptUserLocation = async () => {
    try {
      const position = await GetLocation();
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    } catch (error) {
      if (error === 'User denied geolocation prompt') {
        setIsDisabled(true);
      }
      logger.error(error);
    }
  };

  const sx = {
    backgroundColor: 'white',
    borderRadius: 99,
    padding: 4,
    ':hover': {
      backgroundColor: 'lightgray',
    },
  };

  return (
    <>
      <Button
        data-tooltip-content={isDisabled ? DENIED_TOOLTIP : ZOOM_IN_TOOLTIP}
        data-cy="LocationViewButton"
        data-tooltip-id="locationButton-tooltip"
        sx={sx}
        onClick={() => {
          promptUserLocation();
          setZoom(9);
        }}
        disabled={isDisabled}
        icon="gps-location"
      />
      <Tooltip id="locationButton-tooltip" place="left" />
    </>
  );
};
