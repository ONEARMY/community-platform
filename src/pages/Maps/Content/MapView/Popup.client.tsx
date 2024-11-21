import React, { useEffect, useRef } from 'react'
import { Popup as LeafletPopup } from 'react-leaflet'
import L from 'leaflet'
import { PinProfile } from 'oa-components'

import type { ILatLng, IMapPin, IMapPinWithDetail } from 'oa-shared'
import type { Map } from 'react-leaflet'

import './popup.css'

interface IProps {
  activePin: IMapPin | IMapPinWithDetail
  mapRef: React.RefObject<Map>
  onClose?: () => void
  customPosition?: ILatLng
}

export const Popup = (props: IProps) => {
  const leafletRef = useRef<LeafletPopup>(null)
  const activePin = props.activePin as IMapPinWithDetail
  const { mapRef, onClose, customPosition } = props

  useEffect(() => {
    openPopup()
  }, [props])

  // HACK - as popup is created dynamically want to be able to trigger
  // open on props change
  const openPopup = () => {
    if (leafletRef.current && mapRef.current) {
      leafletRef.current.leafletElement.openOn(mapRef.current!.leafletElement)
    }
  }

  return (
    activePin.location && (
      <LeafletPopup
        ref={leafletRef}
        position={
          customPosition
            ? customPosition
            : [activePin.location.lat, activePin.location.lng]
        }
        offset={new L.Point(2, -10)}
        closeOnClick={false}
        closeOnEscapeKey={false}
        closeButton={false}
        className={activePin !== undefined ? '' : 'closed'}
        minWidth={250}
        maxWidth={300}
      >
        {onClose && <PinProfile item={activePin} onClose={onClose} />}
      </LeafletPopup>
    )
  )
}
