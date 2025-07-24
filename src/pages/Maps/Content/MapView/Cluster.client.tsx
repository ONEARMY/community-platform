import * as React from 'react'
import { Marker } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'

import { createClusterIcon, createMarkerIcon } from './Sprites'

import type { MapPin } from 'oa-shared'

import 'react-leaflet-markercluster/dist/styles.min.css'

interface IProps {
  pins: MapPin[]
  onPinClick: (pin: MapPin) => void
  prefix?: string // Temporarily needed while two maps are rendered
}

export const Clusters: React.FunctionComponent<IProps> = ({
  pins,
  prefix,
  onPinClick,
}) => {
  /**
   * Documentation of Leaflet Clusters for better understanding
   * https://github.com/Leaflet/Leaflet.markercluster#clusters-methods
   *
   */
  return (
    <MarkerClusterGroup
      iconCreateFunction={createClusterIcon()}
      showCoverageOnHover={false}
      spiderfyOnMaxZoom={true}
      // Pin Icon size is always 37x37 px
      // This means max overlay of pins is 5px when not clustered
      maxClusterRadius={54}
    >
      {pins
        .filter(({ lat }) => Boolean(lat))
        .map((pin) => (
          <Marker
            key={`${prefix}-${pin.id}`}
            position={[pin.lat, pin.lng]}
            icon={createMarkerIcon(pin)}
            onClick={() => {
              onPinClick(pin)
            }}
          />
        ))}
    </MarkerClusterGroup>
  )
}
