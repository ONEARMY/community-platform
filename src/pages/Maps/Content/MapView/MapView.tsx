import React, { useEffect } from 'react'
import { Map, TileLayer } from 'react-leaflet'

import { Clusters } from './Cluster'
import { Popup } from './Popup'

import type { LatLngExpression } from 'leaflet'
import type { ILatLng, IMapPin } from 'src/models/maps.models'

import 'leaflet/dist/leaflet.css'
import './index.css'

interface IProps {
  activePin: IMapPin | null
  center: ILatLng
  mapRef: React.RefObject<Map>
  pins: Array<IMapPin>
  zoom: number
  onPinClicked: (pin: IMapPin) => void
  onBlur: () => void
}

export const MapView = (props: IProps) => {
  useEffect(() => {
    if (props.mapRef.current) {
      /*return*/ props.mapRef.current.leafletElement.zoomControl?.setPosition(
        'bottomleft',
      )
    }
  }, [])

  const { center, zoom, pins, activePin } = props
  const isViewportGreaterThanTablet = window.innerWidth > 1024

  const mapCenter: LatLngExpression = center ? [center.lat, center.lng] : [0, 0]
  const mapZoom = center ? zoom : 2

  return (
    <Map
      ref={props.mapRef}
      className="markercluster-map"
      center={mapCenter}
      zoom={mapZoom}
      maxZoom={18}
      zoomControl={isViewportGreaterThanTablet}
      style={{ height: '100%', zIndex: 0 }}
      onclick={() => {
        props.onBlur()
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
      />
      <Clusters pins={pins} onPinClick={props.onPinClicked} />
      {activePin && <Popup activePin={activePin} map={props.mapRef} />}
    </Map>
  )
}
