import { forwardRef, useImperativeHandle, useRef } from 'react'
import { Marker } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'

import { createClusterIcon, createMarkerIcon } from './Sprites'

import type { IMapPin } from 'oa-shared'

import 'react-leaflet-markercluster/dist/styles.min.css'

interface IProps {
  pins: Array<IMapPin>
  onPinClick: (pin: IMapPin) => void
  prefix?: string // Temporarily needed while two maps are rendered
}

export interface ClustersRef {
  markerClusterGroup: any
}

export const Clusters = forwardRef<ClustersRef, IProps>(
  ({ pins, prefix, onPinClick }, ref) => {
    const markerClusterGroupRef = useRef<any>(null)

    useImperativeHandle(ref, () => ({
      // For react-leaflet v2, the Leaflet instance is available as leafletElement
      markerClusterGroup: markerClusterGroupRef.current
        ? markerClusterGroupRef.current.leafletElement
        : null,
    }))

    return (
      <MarkerClusterGroup
        ref={markerClusterGroupRef}
        iconCreateFunction={createClusterIcon()}
        showCoverageOnHover={false}
        spiderfyOnMaxZoom={true}
        // Pin Icon size is always 37x37 px
        // This means max overlay of pins is 5px when not clustered
        maxClusterRadius={54}
      >
        {pins
          .filter(({ location }) => Boolean(location))
          .map((pin) => (
            <Marker
              key={`${prefix}-${pin._id}`}
              position={[pin.location.lat, pin.location.lng]}
              icon={createMarkerIcon(pin)}
              onClick={() => {
                onPinClick(pin)
              }}
              properties={{ pinId: pin._id }}
            />
          ))}
      </MarkerClusterGroup>
    )
  },
)

Clusters.displayName = 'Clusters'
