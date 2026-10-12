import { Button } from 'oa-components';
import type { ILatLng } from 'oa-shared';
import { useEffect, useState } from 'react';
import { logger } from 'src/logger';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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

  const handleClick = () => {
    if (isDisabled) {
      return;
    }
    promptUserLocation();
    setZoom(9);
  };

  const label = isDisabled ? DENIED_TOOLTIP : ZOOM_IN_TOOLTIP;

  return (
    <Tooltip>
      <TooltipTrigger
        render={<Button sx={sx} icon="gps-location" />}
        data-cy="LocationViewButton"
        aria-label={label}
        aria-disabled={isDisabled}
        onClick={handleClick}
      />
      <TooltipContent side="left">{label}</TooltipContent>
    </Tooltip>
  );
};
