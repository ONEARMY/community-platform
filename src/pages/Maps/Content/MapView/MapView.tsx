import { useEffect } from 'react'
import { Map } from 'oa-components'

import { Clusters } from './Cluster'
import { Popup } from './Popup'

import type { LatLngExpression } from 'leaflet'
import type { Map as MapType } from 'react-leaflet'
import type { ILatLng, IMapPin } from 'src/models/maps.models'

interface IProps {
  activePin: IMapPin | null
  center: ILatLng
  mapRef: React.RefObject<MapType>
  pins: Array<IMapPin>
  zoom: number
  onPinClicked: (pin: IMapPin) => void
  onBlur: () => void
}

export const MapView = (props: IProps) => {
  const { activePin, center, mapRef, onPinClicked, pins, zoom } = props

  useEffect(() => {
    if (mapRef.current) {
      /*return*/ mapRef.current.leafletElement.zoomControl?.setPosition(
        'bottomleft',
      )
    }
  }, [])

  const isViewportGreaterThanTablet = window.innerWidth > 1024
  const mapCenter: LatLngExpression = center ? [center.lat, center.lng] : [0, 0]
  const mapZoom = center ? zoom : 2

  return (
    <Map
      ref={mapRef}
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
      <Clusters pins={pins} onPinClick={onPinClicked} />
      {activePin && <Popup activePin={activePin} mapRef={mapRef} />}
    </Map>
  )
}
