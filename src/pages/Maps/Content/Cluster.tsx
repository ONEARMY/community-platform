import * as React from 'react'
import { Marker } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'

import 'react-leaflet-markercluster/dist/styles.min.css'

import { createClusterIcon, createMarkerIcon } from './Sprites'

import { IMapPin, EntityType } from 'src/models/maps.models'

interface IProps {
  pins: Array<IMapPin>
}

export const Clusters: React.SFC<IProps> = ({ pins }) => {
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
                key={pin.id}
                position={[pin.location.lat, pin.location.lng]}
                icon={createMarkerIcon(pin)}
              />
            ))}
          </MarkerClusterGroup>
        )
      })}
    </React.Fragment>
  )
}
