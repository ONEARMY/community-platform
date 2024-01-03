import React, { useCallback, useEffect } from 'react'
import { Map, TileLayer } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import debounce from 'debounce'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { useCommonStores } from 'src/index'

import { Clusters } from './Cluster'
import { Popup } from './Popup'

import type { LatLngExpression } from 'leaflet'
import type {
  IBoundingBox,
  ILatLng,
  IMapGrouping,
  IMapPin,
} from 'src/models/maps.models'

import 'leaflet/dist/leaflet.css'
import './index.css'

interface IProps {
  pins: Array<IMapPin>
  filters: Array<IMapGrouping>
  onBoundingBoxChange: (boundingBox: IBoundingBox) => void
  onPinClicked?: (pin: IMapPin) => void
  center: ILatLng
  zoom: number
  mapRef: React.RefObject<Map>
}

export const MapView = observer((props: IProps) => {
  const { mapsStore } = useCommonStores().stores
  const navigate = useNavigate()

  // Is this needed?
  // const defaultProps: Partial<IProps> = {
  //   onBoundingBoxChange: () => null,
  //   onPinClicked: () => null,
  //   pins: [],
  //   filters: [],
  //   center: { lat: 51.0, lng: 19.0 },
  //   zoom: 3,
  // }

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

  const pinClicked = async (pin: IMapPin) => {
    await mapsStore.setActivePin(pin)
    navigate('/map#' + pin._id)
  }

  const { center, zoom, pins } = props
  const { activePin } = mapsStore
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
        mapsStore.setActivePin(undefined)
        navigate('/map')
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
      />
      <Clusters pins={pins} onPinClick={(pin) => pinClicked(pin)} />
      {activePin && mapsStore.canSeePin(activePin) && (
        // NOTE CC - 2021-07-06 mobx update no longer passing JS object, but observable that needs converting
        <Popup activePin={toJS(activePin)} map={props.mapRef} />
      )}
    </Map>
  )
})
