import React, { useEffect, useRef } from 'react'
import { Popup as LeafletPopup } from 'react-leaflet'
import L from 'leaflet'
import { MapMemberCard, PinProfile } from 'oa-components'
import { IModerationStatus } from 'oa-shared'
import { MAP_GROUPINGS } from 'src/stores/Maps/maps.groupings'

import type { ILatLng, IMapPin, IMapPinWithDetail } from 'oa-shared'
import type { Map } from 'react-leaflet'

import './popup.css'

interface IProps {
  activePin: IMapPin | IMapPinWithDetail
  mapRef: React.RefObject<Map>
  newMap?: boolean
  onClose?: () => void
  customPosition?: ILatLng
}

export const Popup = (props: IProps) => {
  const leafletRef = useRef<LeafletPopup>(null)
  const activePin = props.activePin as IMapPinWithDetail
  const { mapRef, newMap, onClose, customPosition } = props

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

  const getHeading = (pin: IMapPinWithDetail) => {
    const group = MAP_GROUPINGS.find((g) => {
      return pin.subType
        ? g.subType === pin.subType && g.type === pin.type
        : g.type === pin.type
    })
    return group ? group.displayName : pin.type
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
        minWidth={230}
        maxWidth={230}
      >
        {newMap && onClose && <PinProfile item={activePin} onClose={onClose} />}
        {!newMap && (
          <MapMemberCard
            loading={!activePin.creator}
            imageUrl={
              activePin.creator?.coverImage ||
              activePin.creator?.userImage ||
              ''
            }
            comments={
              activePin.comments &&
              activePin.moderation === IModerationStatus.IMPROVEMENTS_NEEDED
                ? activePin.comments
                : null
            }
            description={activePin.creator?.about || ''}
            user={{
              isVerified: !!activePin.creator?.badges?.verified,
              userName: activePin.creator?._id || '',
              countryCode: activePin.creator?.countryCode,
            }}
            heading={getHeading(activePin)}
          />
        )}
      </LeafletPopup>
    )
  )
}
