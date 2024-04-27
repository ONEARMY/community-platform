import React, { useCallback, useEffect } from 'react'
import { Map, TileLayer } from 'react-leaflet'
import debounce from 'debounce'
import { observer } from 'mobx-react'

import { Clusters } from './Cluster'
import { Popup } from './Popup'

import type { LatLngExpression } from 'leaflet'
import type { IBoundingBox, ILatLng, IMapPin } from 'src/models/maps.models'

import 'leaflet/dist/leaflet.css'
import './index.css'

interface IProps {
  activePin: IMapPin | null
  center: ILatLng
  mapRef: React.RefObject<Map>
  pins: Array<IMapPin>
  zoom: number
  onBoundingBoxChange: (boundingBox: IBoundingBox) => void
  onPinClicked: (pin: IMapPin) => void
  onBlur: () => void
}

export const MapView = observer((props: IProps) => {
  // on move end want to calculate current bounding box and notify parent
  // so that pins can be displayed as required
  const handleMove = useCallback(
    debounce(() => {
      if (props.mapRef.current) {
        const boundingBox = props.mapRef.current.leafletElement.getBounds()
        const newBoundingBox: IBoundingBox = {
          topLeft: boundingBox.getNorthWest(),
          bottomRight: boundingBox.getSouthEast(),
        }
        props.onBoundingBoxChange(newBoundingBox)
      }
    }, 1000),
    [],
  )

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
      onmove={handleMove}
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
})
