import React from 'react'
import L from 'leaflet'
import Flex from 'src/components/Flex'
import Text from 'src/components/Text'
import { Popup as LeafletPopup, Map } from 'react-leaflet'
import styled from 'styled-components'
import { distanceInWords } from 'date-fns'

import {
  IMapPin,
  IMapPinWithDetail,
  IMapPinDetail,
} from 'src/models/maps.models'

import './popup.css'
import { Link } from 'src/components/Links'
import { inject } from 'mobx-react'
import { MapsStore } from 'src/stores/Maps/maps.store'
import { MAP_GROUPINGS } from 'src/stores/Maps/maps.groupings'
import Workspace from 'src/pages/User/workspace/Workspace'

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
  constructor(props: IProps) {
    super(props)
  }

  get injected() {
    return this.props as IInjectedProps
  }

  componentWillReceiveProps() {
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

  private renderContent(pin: IMapPinWithDetail) {
    const group = MAP_GROUPINGS.find(g => {
      return pin.subType
        ? g.subType === pin.subType && g.type === pin.type
        : g.type === pin.type
    })
    const { lastActive, heroImageUrl, shortDescription, name } = pin.detail
    const lastActiveText = lastActive
      ? distanceInWords(lastActive, new Date())
      : 'a long time'
    console.log('detail', pin.detail)

    function addFallbackSrc(ev: any) {
      const icon = Workspace.findWorkspaceBadge(pin.type, true)
      ev.target.src = icon
    }

    return (
      <>
        <HeroImage src={heroImageUrl} onError={addFallbackSrc} />
        <Flex flexDirection={'column'} px={2} py={2}>
          <Text tags mb={2}>
            {group ? group.displayName : pin.type}
          </Text>
          <Link to={'u/' + name}>
            <Text medium mb={1}>
              {name}
            </Text>
          </Link>
          <Text auxiliary small clipped mb={2}>
            {shortDescription}
          </Text>
          <LastOnline>last active {lastActiveText} ago</LastOnline>
        </Flex>
      </>
    )
  }

  public render() {
    console.log('popup render', this.props.activePin)
    const activePin = this.props.activePin as IMapPinWithDetail
    const content = activePin.detail
      ? this.renderContent(activePin)
      : this.renderLoading()

    return (
      <LeafletPopup
        ref={this.leafletRef}
        position={[activePin.location.lat, activePin.location.lng]}
        offset={new L.Point(2, -10)}
        closeButton={false}
        className={activePin !== undefined ? '' : 'closed'}
        minWidth={230}
        maxWidth={230}
      >
        {content}
      </LeafletPopup>
    )
  }
}
