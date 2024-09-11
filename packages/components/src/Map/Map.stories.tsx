import { useState } from 'react'

import { Map } from './Map'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Map/Map',
  component: Map,
} as Meta<typeof Map>

export const Default: StoryFn<typeof Map> = () => {
  const [zoom, setZoom] = useState<number>(1)
  return (
    <Map
      zoom={zoom}
      setZoom={setZoom}
      style={{
        height: '450px',
        width: '800px',
      }}
      center={[0, 0]}
    />
  )
}
