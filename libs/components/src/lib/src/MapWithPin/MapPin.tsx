import * as React from 'react'
import { Marker } from 'react-leaflet'
import L from 'leaflet'

import customMarkerIcon from '../../assets/icons/map-marker.png'

const customMarker = L.icon({
  iconUrl: customMarkerIcon,
  iconSize: [20, 28],
  iconAnchor: [10, 28],
})

export interface IProps {
  position: {
    lat: number
    lng: number
  }
  draggable: boolean
  ondragend(lng: number): void
}

export const MapPin = (props: IProps) => {
  const markerRef = React.useRef(null)

  return (
    <Marker
      draggable={props.draggable}
      ondragend={() => {
        const marker: any = markerRef.current

        if (!marker) {
          return null
        }

        const markerLatLng = marker.leafletElement.getLatLng()
        if (props.ondragend) {
          props.ondragend(markerLatLng)
        }
      }}
      position={[props.position.lat, props.position.lng]}
      ref={markerRef}
      icon={customMarker}
    />
  )
}
