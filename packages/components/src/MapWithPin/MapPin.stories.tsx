import { MapPin } from './MapPin.client'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/MapPin',
  component: MapPin,
} as Meta<typeof MapPin>

export const Default: StoryFn<typeof MapPin> = () => {
  const position = { lat: 0, lng: 0 }
  return (
    <MapPin
      position={position}
      draggable={true}
      ondragend={(lng: number) => {
        position.lng = lng
      }}
    />
  )
}
