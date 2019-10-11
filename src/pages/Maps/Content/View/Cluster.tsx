import * as React from 'react'
import { Marker } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'

import 'react-leaflet-markercluster/dist/styles.min.css'

import { createClusterIcon, createMarkerIcon } from './Sprites'

import { IPinType, EntityType, IMapPinWithType } from 'src/models/maps.models'

interface IProps {
  pins: Array<IMapPinWithType>
  onPinClick: (pin: IPinType) => void
}

export const Clusters: React.FunctionComponent<IProps> = ({
  pins,
  onPinClick,
}) => {
  const entities = pins.reduce(
    (accumulator, pin) => {
      const { grouping } = pin.pinType
      if (!accumulator.hasOwnProperty(grouping)) {
        accumulator[grouping] = []
      }
      accumulator[grouping].push(pin)
      return accumulator
    },
    {} as Record<EntityType, Array<IMapPinWithType>>,
  )

  return (
    <React.Fragment>
      {Object.keys(entities).map(key => {
        return (
          <MarkerClusterGroup
            iconCreateFunction={createClusterIcon(
              key,
              entities[key],
              pins.length,
            )} // entities.individual.length + entities.place.length)}
            key={key}
            showCoverageOnHover={false}
            spiderfyOnMaxZoom={false}
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
