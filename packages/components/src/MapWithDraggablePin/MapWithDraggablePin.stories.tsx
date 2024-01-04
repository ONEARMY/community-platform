import { MapWithDraggablePin } from './MapWithDraggablePin'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/MapWithDraggablePin',
  component: MapWithDraggablePin,
} as Meta<typeof MapWithDraggablePin>

export const Default: StoryFn<typeof MapWithDraggablePin> = () => {
  const position = { lat: 0, lng: 0 }
  return (
    <MapWithDraggablePin
      position={position}
      updatePosition={(_position: { lat: number; lng: number }) => {
        position.lat = _position.lat
        position.lng = _position.lng
      }}
    />
  )
}
