import * as React from 'react'
import { Marker } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { useCommonStores } from 'src/common/hooks/useCommonStores'

import { createClusterIcon, createMarkerIcon } from './Sprites'

import type { IMapPin } from 'src/models/maps.models'

import 'react-leaflet-markercluster/dist/styles.min.css'

interface IProps {
  pins: Array<IMapPin>
  onPinClick: (pin: IMapPin) => void
  prefix?: string // Temporarily needed while two maps are rendered
}

export const Clusters = (props: IProps) => {
  const { pins, prefix, onPinClick } = props
  const { stores } = useCommonStores()
  const currentTheme = stores.themeStore.currentTheme

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
      maxClusterRadius={32}
    >
      {pins
        .filter(({ location }) => Boolean(location))
        .map((pin) => (
          <Marker
            key={`${prefix}-${pin._id}`}
            position={[pin.location.lat, pin.location.lng]}
            icon={createMarkerIcon(pin, currentTheme)}
            onClick={() => {
              onPinClick(pin)
            }}
          />
        ))}
    </MarkerClusterGroup>
  )
}
