import * as React from 'react'
import L from 'leaflet'
import { Image, Text, Flex } from 'theme-ui'
import { Button, MapMemberCard } from 'oa-components'
import type { Map } from 'react-leaflet'
import { Popup as LeafletPopup } from 'react-leaflet'
import styled from '@emotion/styled'
import { distanceInWords } from 'date-fns'

import type { IMapPin, IMapPinWithDetail } from 'src/models/maps.models'

import './popup.css'
import { inject } from 'mobx-react'
import type { MapsStore } from 'src/stores/Maps/maps.store'
import { MAP_GROUPINGS } from 'src/stores/Maps/maps.groupings'
import Workspace from 'src/pages/User/workspace/Workspace'
import VerifiedBadgeIcon from 'src/assets/icons/icon-verified-badge.svg'
import theme from 'src/themes/styled.theme'
import { Link } from 'react-router-dom'

interface IProps {
  activePin: IMapPin | IMapPinWithDetail
  map: React.RefObject<Map>
}
interface IInjectedProps extends IProps {
  mapsStore: MapsStore
}

const HeroImage = styled.img`
  width: 100%;
  background-color: lightgrey;
  height: 120px;
  object-fit: cover;
`

const LastOnline = styled.div`
  margin: 7px 2px;
  color: grey;
  font-size: 0.6rem;
`

@inject('mapsStore')
export class Popup extends React.Component<IProps> {
  leafletRef: React.RefObject<LeafletPopup> = React.createRef()
  private moderatePin = async (pin: IMapPin, accepted: boolean) => {
    await this.store.moderatePin({
      ...pin,
      moderation: accepted ? 'accepted' : 'rejected',
    })
    if (!accepted) {
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

  private renderLoading() {
    return 'loading'
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
            }}
            heading={this.getHeading(activePin)}
          />
        </LeafletPopup>
      )
    )
  }
}
