import React from 'react'
import L from 'leaflet'
import Flex from 'src/components/Flex'
import Text from 'src/components/Text'
import { Popup as LeafletPopup } from 'react-leaflet'
import styled from 'styled-components'
import { distanceInWords } from 'date-fns'

import { IMapPin, IMapPinDetail } from 'src/models/maps.models'

import './popup.css'
import { Link } from 'src/components/Links'

interface IProps {
  pinDetail?: IMapPin | IMapPinDetail
  map: any
}

const HeroImage = styled.div<{ src: string }>`
  width: 100%;
  background-image: url("${props => props.src}");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  background-color: lightgrey;
  height: 120px;
  object-fit: cover;
`

interface IPinTypeDotProps {
  type: string
}
const PinTypeDot = styled.div<IPinTypeDotProps>`
  background-color: ${p => (p.type === 'place' ? 'red' : 'blue')};
  display: inline-block;
  border-radius: ${p => (p.type === 'place' ? '0%' : '50%')};
  line-height: 25px;
  text-align: center;
  color: white;
  width: 25px;
  height: 25px;
`

const LastOnline = styled.div`
  margin: 7px 2px;
  color: grey;
  font-size: 0.6rem;
`

export class Popup extends React.Component<IProps> {
  private popup

  constructor(props) {
    super(props)
    this.popup = React.createRef()
  }

  componentDidUpdate(prevProps) {
    if (this.props.pinDetail === undefined) {
      return
    }

    this.setPinLocation(this.props.pinDetail)
  }

  private setPinLocation(pin) {
    this.popup.current.leafletElement
      .setLatLng([pin.location.lat, pin.location.lng])
      .openOn(this.props.map.current.leafletElement)
  }

  private renderLoading() {
    return 'loading'
  }

  private renderContent({
    heroImageUrl,
    profilePicUrl,
    name,
    pinType,
    shortDescription,
    lastActive,
  }) {
    let lastActiveText: string = 'a long time'

    if (lastActive) {
      lastActiveText = distanceInWords(lastActive, new Date())
    }

    return (
      <>
        <HeroImage src={heroImageUrl} />
        <Flex flexDirection={'column'} px={2} py={2}>
          <Text tags mb={2}>
            {pinType.displayName}
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
    const { pinDetail } = this.props

    const content =
      pinDetail !== undefined && (pinDetail as IMapPinDetail).name
        ? this.renderContent(pinDetail as IMapPinDetail)
        : this.renderLoading()

    return (
      <LeafletPopup
        ref={this.popup}
        position={[0, 0]}
        offset={new L.Point(2, -10)}
        closeButton={false}
        className={this.props.pinDetail !== undefined ? '' : 'closed'}
        minWidth={230}
        maxWidth={230}
      >
        {content}
      </LeafletPopup>
    )
  }
}
