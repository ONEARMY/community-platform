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
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {children}
    </LeafletMap>
  )
})

Map.displayName = 'Map'
