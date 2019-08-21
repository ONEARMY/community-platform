import React, { RefObject } from 'react'
import L from 'leaflet'
import { Image } from 'rebass'
import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Popup as LeafletPopup } from 'react-leaflet'
import styled from 'styled-components'
import { distanceInWords } from 'date-fns'

import { IMapPin, IMapPinDetail } from 'src/models/maps.models'

import './popup.css'
interface IProps {
  pinDetail?: IMapPin | IMapPinDetail
  map: any
}

const HeroImage = styled(Image)`
  width: 100%;
  height: 120x;
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

  public componentDidUpdate(prevProps) {
    if (this.props.pinDetail === undefined) {
      return
    }

    if (
      prevProps.pinDetail === undefined ||
      prevProps.pinDetail.id !== this.props.pinDetail!.id
    ) {
      this.setPinLocation(this.props.pinDetail)
    }
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
    return (
      <>
        <HeroImage src={heroImageUrl} />
        <Flex flexDirection={'column'} px={2} py={2}>
          <Text tags mb={2}>
            {pinType.displayName}
          </Text>
          <Text medium mb={1}>
            {name}
          </Text>
          <Text auxiliary small mb={2}>
            {shortDescription}
          </Text>
          <LastOnline>
            last active {distanceInWords(lastActive, new Date())} ago
          </LastOnline>
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
