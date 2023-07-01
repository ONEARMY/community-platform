import * as React from 'react'
import L from 'leaflet'
import { MapMemberCard } from 'oa-components'
import type { Map } from 'react-leaflet'
import { Popup as LeafletPopup } from 'react-leaflet'

import type { IMapPin, IMapPinWithDetail } from 'src/models/maps.models'

import './popup.css'
import { inject } from 'mobx-react'
import type { MapsStore } from 'src/stores/Maps/maps.store'
import { MAP_GROUPINGS } from 'src/stores/Maps/maps.groupings'

interface IProps {
  activePin: IMapPin | IMapPinWithDetail
  map: React.RefObject<Map>
}
interface IInjectedProps extends IProps {
  mapsStore: MapsStore
}

@inject('mapsStore')
export class Popup extends React.Component<IProps> {
  leafletRef: React.RefObject<LeafletPopup> = React.createRef()
  private _moderatePin = async (pin: IMapPin, isAccepted: boolean) => {
    await this.store.moderatePin({
      ...pin,
      moderation: isAccepted ? 'accepted' : 'rejected',
    })
    if (!isAccepted) {
      this.injected.mapsStore.setActivePin(undefined)
    }
  }

  // eslint-disable-next-line
  constructor(props: IProps) {
    super(props)
  }

  get injected() {
    return this.props as IInjectedProps
  }

  get store() {
    return this.injected.mapsStore
  }

  /* eslint-disable @typescript-eslint/naming-convention*/
  UNSAFE_componentWillReceiveProps() {
    this.openPopup()
  }

  // HACK - as popup is created dynamically want to be able to trigger
  // open on props change
  public openPopup() {
    if (this.leafletRef.current) {
      this.leafletRef.current.leafletElement.openOn(
        this.props.map.current!.leafletElement,
      )
    }
  }

  private getHeading(pin: IMapPinWithDetail): string {
    const group = MAP_GROUPINGS.find((g) => {
      return pin.subType
        ? g.subType === pin.subType && g.type === pin.type
        : g.type === pin.type
    })
    return group ? group.displayName : pin.type
  }

  public render() {
    const activePin = this.props.activePin as IMapPinWithDetail

    return (
      activePin.location && (
        <LeafletPopup
          ref={this.leafletRef}
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
            lastActive={activePin.detail?.lastActive || ''}
            description={activePin.detail?.shortDescription}
            user={{
              isVerified: !!activePin.detail?.verifiedBadge,
              username: activePin.detail?.name,
              country: activePin.detail?.country,
            }}
            heading={this.getHeading(activePin)}
            moderationStatus={activePin.moderation}
            onPinModerated={(isPinApproved) => {
              this._moderatePin(activePin, isPinApproved)
            }}
            isEditable={!!this.store.needsModeration(activePin)}
          />
        </LeafletPopup>
      )
    )
  }
}
