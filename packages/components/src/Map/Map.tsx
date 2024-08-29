import { forwardRef } from 'react'
import { Map as LeafletMap, TileLayer } from 'react-leaflet'

import type { Ref, RefObject } from 'react'
import type { MapProps, Viewport } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import './index.css'

export interface IProps extends MapProps {
  children?: React.ReactNode | React.ReactNode[]
  setZoom: (arg: number) => void
  ref?: RefObject<LeafletMap> | undefined
}

export const Map = forwardRef((props: IProps, ref: Ref<LeafletMap>) => {
  const { children, setZoom } = props

  const onViewportChanged = (viewport: Viewport) => {
    viewport.zoom && setZoom(viewport.zoom)
  }

  return (
    <LeafletMap ref={ref} onViewportChanged={onViewportChanged} {...props}>
      {children}
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </LeafletMap>
  )
})

Map.displayName = 'Map'
