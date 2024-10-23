import { useEffect } from 'react'
import { Map } from 'oa-components'

import { Clusters } from './Cluster.client'
import { Popup } from './Popup.client'

import type { LatLngExpression } from 'leaflet'
import type { ILatLng, IMapPin } from 'oa-shared'
import type { Map as MapType } from 'react-leaflet'

interface IProps {
  activePin: IMapPin | null
  center: ILatLng
  mapRef: React.RefObject<MapType>
  pins: Array<IMapPin>
  zoom: number
  onPinClicked: (pin: IMapPin) => void
  onBlur: () => void
  setZoom: (arg: number) => void
}

export const MapView = (props: IProps) => {
  const { activePin, center, mapRef, onPinClicked, pins, zoom, setZoom } = props
  const isViewportGreaterThanTablet = window.innerWidth > 1024
  const mapCenter: LatLngExpression = center ? [center.lat, center.lng] : [0, 0]
  const mapZoom = center ? zoom : 2

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.leafletElement.zoomControl?.setPosition('bottomleft')
    }
  }, [])

  return (
    <Map
      ref={mapRef}
      className="markercluster-map"
      center={mapCenter}
      zoom={mapZoom}
      setZoom={setZoom}
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
