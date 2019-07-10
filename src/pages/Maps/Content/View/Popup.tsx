import React, { RefObject } from 'react'
import L from 'leaflet'
import { Popup as LeafletPopup } from 'react-leaflet'
import styled from 'styled-components'
import { distanceInWords } from 'date-fns'

import { IMapPin, IMapPinDetail } from 'src/models/maps.models'

interface IProps {
  pinDetail?: IMapPin | IMapPinDetail
  map: any
}

const HeroImage = styled.img`
  width: 285px;
  height: 175px;
`

const ProfileImage = styled.img`
  width 50px;
  height: 50px;
  border-radius: 50%;
  margin-top: -25px;
  margin-left: 15px;
`

const ContentWrapper = styled.div`
  padding: 10px 20px;
  line-height: 1.5em;
`

const ComradeName = styled.div`
  text-decoration: underline;
  font-size: 1rem;
`

const PinTypeWrapper = styled.div`
  width: 100%;
  margin: 12px 0px;
  display: flex;
  align-items: center;
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

const PinTypeName = styled.div`
  display: inline-block;
  margin-left: 10px;
  font-weight: bold;
  font-size: 14px;
`

const Description = styled.p`
  font-size: 0.85rem;
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
        <ProfileImage src={profilePicUrl} />
        <ContentWrapper>
          <ComradeName>{name}</ComradeName>
          <PinTypeWrapper>
            <PinTypeDot type={pinType.grouping}>{pinType.icon}</PinTypeDot>
            <PinTypeName>{pinType.displayName}</PinTypeName>
          </PinTypeWrapper>
          <Description>{shortDescription}</Description>
          <LastOnline>
            last active {distanceInWords(lastActive, new Date())} ago
          </LastOnline>
        </ContentWrapper>
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
        minWidth={284}
        maxWidth={284}
      >
        {content}
      </LeafletPopup>
    )
  }
}
