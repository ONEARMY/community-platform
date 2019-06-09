import * as React from 'react'
import { Marker } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { insideBoundingBox, getBoundingBox } from 'geolocation-utils'

import 'react-leaflet-markercluster/dist/styles.min.css'

import { createClusterIcon, createMarkerIcon } from './Sprites'

import { IMapPin, EntityType, IBoundingBox } from 'src/models/maps.models'

interface IProps {
  pins: Array<IMapPin>
  boundingBox: IBoundingBox
}

export const Clusters: React.SFC<IProps> = ({ pins, boundingBox }) => {
  const box = getBoundingBox([boundingBox.topLeft, boundingBox.bottomRight], 0)
  const entities = pins
    .filter(pin => insideBoundingBox(pin.location, box))
    .reduce(
      (accumulator, pin) => {
        const { entityType } = pin
        if (!accumulator.hasOwnProperty(entityType)) {
          accumulator[entityType] = []
        }
        accumulator[entityType].push(pin)
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
