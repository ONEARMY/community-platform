import { useRef } from 'react';

import { MapWithPin } from './MapWithPin.client';

import type { Meta, StoryFn } from '@storybook/react-vite';
import type { Map } from 'react-leaflet';

export default {
  title: 'Map/MapWithPin',
  component: MapWithPin,
} as Meta<typeof MapWithPin>;

export const Default: StoryFn<typeof MapWithPin> = () => {
  const position = { lat: 0, lng: 0 };
  const newMapRef = useRef<Map>(null);

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
