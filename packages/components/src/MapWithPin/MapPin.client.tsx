import { useRef, useState } from 'react'
import { Marker } from 'react-leaflet'
import L from 'leaflet'

import customMarkerIcon from '../../assets/icons/map-marker.png'

import type { DivIcon } from 'leaflet'

import './MapPin.css'

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
  onDrag(lng: number): void
  markerIcon?: DivIcon
  onClick?: () => void
}

export const MapPin = (props: IProps) => {
  const markerRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDrag = () => {
    const marker: any = markerRef.current

    if (!marker) {
      return
    }

    const markerLatLng = marker.leafletElement.getLatLng()
    if (props.onDrag) {
      props.onDrag(markerLatLng)
    }
  }

  return (
    <Marker
      className={`map-pin ${isDragging ? 'dragging' : ''}`}
      draggable
      onDrag={handleDrag}
      position={[props.position.lat, props.position.lng]}
      ref={markerRef}
      icon={props.markerIcon || customMarker}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onclick={props.onClick}
    />
  )
}
