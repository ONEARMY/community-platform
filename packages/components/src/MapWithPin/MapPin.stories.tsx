import type { LatLng } from 'leaflet';
import { MapPin } from './MapPin.client';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Map/MapPin',
  component: MapPin,
} as Meta<typeof MapPin>;

export const Default: StoryFn<typeof MapPin> = () => {
  const position = { lat: 0, lng: 0 };
  return (
    <MapPin
      position={position}
      onDrag={(latlng: LatLng) => {
        position.lat = latlng.lat;
        position.lng = latlng.lng;
      }}
    />
  );
};
