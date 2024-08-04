import { MapWithPin } from './MapWithPin.client'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/MapWithPin',
  component: MapWithPin,
} as Meta<typeof MapWithPin>

export const Default: StoryFn<typeof MapWithPin> = () => {
  const position = { lat: 0, lng: 0 }
  return (
    <MapWithPin
      position={position}
      draggable={true}
      updatePosition={(_position: { lat: number; lng: number }) => {
        position.lat = _position.lat
        position.lng = _position.lng
      }}
    />
  )
}
