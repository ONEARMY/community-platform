import * as React from 'react'
import { Marker } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'

import 'react-leaflet-markercluster/dist/styles.min.css'

import { createClusterIcon, createMarkerIcon } from './Sprites'

import { IPinGrouping, IMapPin } from 'src/models/maps.models'

interface IProps {
  pins: Array<IMapPin>
  onPinClick: (pin: IMapPin) => void
}

export const Clusters: React.FunctionComponent<IProps> = ({
  pins,
  onPinClick,
  children,
}) => {
  const entities = pins.reduce(
    (accumulator, pin) => {
      const grouping = pin.type
      if (!accumulator.hasOwnProperty(grouping)) {
        accumulator[grouping] = []
      }
      accumulator[grouping].push(pin)
      return accumulator
    },
    {} as Record<IPinGrouping, Array<IMapPin>>,
  )

  return (
    <React.Fragment>
      {Object.keys(entities).map(key => {
        return (
          <MarkerClusterGroup
            iconCreateFunction={createClusterIcon({ key })}
            key={key}
            showCoverageOnHover={false}
            spiderfyOnMaxZoom={true}
            // in pixels, radius a cluster can cover
            // max zoom level 18
            maxClusterRadius={(zoomLevel: number) => {
              return 90 - 5 * zoomLevel
            }}
          >
            {entities[key].map(pin => (
              <Marker
                key={pin._id}
                position={[pin.location.lat, pin.location.lng]}
                icon={createMarkerIcon(pin)}
                onClick={() => {
                  onPinClick(pin)
                }}
              />
            ))}
          </MarkerClusterGroup>
        )
      })}
    </React.Fragment>
  )
}
