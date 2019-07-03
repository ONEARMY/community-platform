import React, { RefObject } from 'react'
import L from 'leaflet'
import { Popup as LeafletPopup } from 'react-leaflet'

import { IMapPin, IMapPinDetail } from 'src/models/maps.models'

interface IProps {
  pinDetail?: IMapPin | IMapPinDetail
  map: any
}

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

  public render() {
    return (
      <LeafletPopup
        ref={this.popup}
        position={[0, 0]}
        offset={new L.Point(2, -10)}
        closeButton={false}
        className={this.props.pinDetail !== undefined ? '' : 'closed'}
      >
        &nbsp;
      </LeafletPopup>
    )
  }
}
