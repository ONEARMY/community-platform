import type { Map as LeafletMap } from 'leaflet';
import { useRef } from 'react';

import { MapWithPin } from './MapWithPin.client';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Map/MapWithPin',
  component: MapWithPin,
} as Meta<typeof MapWithPin>;

export const Default: StoryFn<typeof MapWithPin> = () => {
  const position = { lat: 0, lng: 0 };
  const newMapRef = useRef<LeafletMap>(null);

  return (
    <MapWithPin
      mapRef={newMapRef}
      position={position}
      updatePosition={(_position: { lat: number; lng: number }) => {
        position.lat = _position.lat;
        position.lng = _position.lng;
      }}
    />
  );
};
