import React, { useEffect, useRef } from 'react'
import { Popup as LeafletPopup } from 'react-leaflet'
import L from 'leaflet'
import { MapMemberCard } from 'oa-components'
import { IModerationStatus } from 'oa-shared'
import { MAP_GROUPINGS } from 'src/stores/Maps/maps.groupings'

import type { Map } from 'react-leaflet'
import type { IMapPin, IMapPinWithDetail } from 'src/models/maps.models'

import './popup.css'

interface IProps {
  activePin: IMapPin | IMapPinWithDetail
  mapRef: React.RefObject<Map>
}

export const Popup = (props: IProps) => {
  const leafletRef = useRef<LeafletPopup>(null)
  const activePin = props.activePin as IMapPinWithDetail
  const { mapRef } = props

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
        position={[activePin.location.lat, activePin.location.lng]}
        offset={new L.Point(2, -10)}
        closeButton={false}
        className={activePin !== undefined ? '' : 'closed'}
        minWidth={230}
        maxWidth={230}
      >
        <MapMemberCard
          loading={!activePin.detail}
          imageUrl={activePin.detail?.heroImageUrl}
          comments={
            activePin.comments &&
            activePin.moderation === IModerationStatus.IMPROVEMENTS_NEEDED
              ? activePin.comments
              : null
          }
          description={activePin.detail?.shortDescription}
          user={{
            isVerified: !!activePin.detail?.verifiedBadge,
            userName: activePin.detail?.name,
            countryCode: activePin.detail?.country?.toLowerCase(),
          }}
          heading={getHeading(activePin)}
        />
      </LeafletPopup>
    )
  )
}
