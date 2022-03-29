import * as React from 'react'
import L from 'leaflet'
import { Image } from 'theme-ui'
import Flex from 'src/components/Flex'
import Text from 'src/components/Text'
import { Button } from 'oa-components'
import { Popup as LeafletPopup, Map } from 'react-leaflet'
import styled from '@emotion/styled'
import { distanceInWords } from 'date-fns'

import { IMapPin, IMapPinWithDetail } from 'src/models/maps.models'

import './popup.css'
import { Link } from 'src/components/Links'
import { inject } from 'mobx-react'
import { MapsStore } from 'src/stores/Maps/maps.store'
import { MAP_GROUPINGS } from 'src/stores/Maps/maps.groupings'
import Workspace from 'src/pages/User/workspace/Workspace'
import VerifiedBadgeIcon from 'src/assets/icons/icon-verified-badge.svg'

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

  private moderatePin = async (pin: IMapPin, accepted: boolean) => {
    await this.store.moderatePin({
      ...pin,
      moderation: accepted ? 'accepted' : 'rejected',
    })
    if (!accepted) {
      this.injected.mapsStore.setActivePin(undefined)
    }
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
    const {
      lastActive,
      heroImageUrl,
      shortDescription,
      name,
      displayName,
      verifiedBadge,
    } = pin.detail
    const description =
      shortDescription.length > 70
        ? shortDescription.substr(0, 70) + '...'
        : shortDescription
    const lastActiveText = lastActive
      ? distanceInWords(lastActive, new Date())
      : 'a long time'
    const moderationStatus =
      pin.moderation !== 'rejected'
        ? 'This pin is awaiting moderation, will be shown on general map once accepted'
        : 'This pin has been rejected, wont show on general map'

    function addFallbackSrc(ev: any) {
      const icon = Workspace.findWorkspaceBadge(pin.type, true)
      ev.target.src = icon
    }

    return (
      <>
        <Link to={'/u/' + name} data-cy="map-pin-popup">
          <HeroImage src={heroImageUrl} onError={addFallbackSrc} />
          <Flex sx={{ flexDirection: 'column' }} px={2} py={2}>
            <Text tags mb={2}>
              {group ? group.displayName : pin.type}
            </Text>
            <Text large mb={1} sx={{ display: 'flex' }}>
              {displayName}
              {verifiedBadge && (
                <Image
                  src={VerifiedBadgeIcon}
                  width="22px"
                  height="22px"
                  style={{ marginLeft: '5px' }}
                />
              )}
            </Text>
            <Text small mb={2} style={{ wordBreak: 'break-word' }}>
              {description}
            </Text>
            <LastOnline>Last active {lastActiveText} ago</LastOnline>
            {pin.moderation !== 'accepted' && (
              <Text
                auxiliary
                small
                bold
                mb={2}
                highlight
                dashed
                critical={pin.moderation === 'rejected'}
              >
                {moderationStatus}
              </Text>
            )}
          </Flex>
        </Link>
        {this.store.needsModeration(pin) && (
          <Flex
            px={10}
            py={1}
            sx={{ flexDirection: 'row', justifyContent: 'space-around' }}
          >
            <Button
              small
              data-cy={'accept'}
              variant={'primary'}
              icon="check"
              onClick={() => this.moderatePin(pin, true)}
              sx={{ height: '30px' }}
            />
            <Button
              small
              data-cy="reject-pin"
              variant={'tertiary'}
              icon="delete"
              onClick={() => this.moderatePin(pin, false)}
              sx={{ height: '30px' }}
            />
          </Flex>
        )}
      </>
    )
  }

  public render() {
    const activePin = this.props.activePin as IMapPinWithDetail
    const content = activePin.detail
      ? this.renderContent(activePin)
      : this.renderLoading()

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
          {content}
        </LeafletPopup>
      )
    )
  }
}
