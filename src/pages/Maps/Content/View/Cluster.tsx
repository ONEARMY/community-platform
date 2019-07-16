import * as React from 'react'
import { Marker } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'

import 'react-leaflet-markercluster/dist/styles.min.css'

import { createClusterIcon, createMarkerIcon } from './Sprites'

import { IMapPin, IPinType, EntityType } from 'src/models/maps.models'

interface IProps {
  pins: Array<IMapPin>
  onPinClick: (pin: IPinType) => void
}

export const Clusters: React.SFC<IProps> = ({ pins, onPinClick }) => {
  const entities = pins.reduce(
    (accumulator, pin) => {
      const { grouping } = pin.pinType
      if (!accumulator.hasOwnProperty(grouping)) {
        accumulator[grouping] = []
      }
      accumulator[grouping].push(pin)
      return accumulator
    },
    {} as Record<EntityType, Array<IMapPin>>,
  )

  return (
    <React.Fragment>
      {Object.keys(entities).map(key => {
        return (
          <MarkerClusterGroup
            iconCreateFunction={createClusterIcon(key)}
            key={key}
            maxClusterRadius={60}
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
