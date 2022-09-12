import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { MapWithDraggablePin } from './MapWithDraggablePin'

export default {
  title: 'Components/MapWithDraggablePin',
  component: MapWithDraggablePin,
} as ComponentMeta<typeof MapWithDraggablePin>

export const Default: ComponentStory<typeof MapWithDraggablePin> = () => {
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
