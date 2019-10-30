import * as React from 'react'
import debounce from 'debounce'
import { Map, TileLayer, ZoomControl } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import './index.css'

import { Clusters } from './Cluster'
import { Popup } from './Popup'

import {
  IMapPin,
  IMapPinDetail,
  ILatLng,
  IBoundingBox,
  IPinType,
  IMapPinWithType,
} from 'src/models/maps.models'

interface IProps {
  pins: Array<IMapPinWithType>
  filters: Array<IPinType>
  onBoundingBoxChange: (boundingBox: IBoundingBox) => void
  onPinClicked: (pin: IMapPin) => void
  activePinDetail?: IMapPin | IMapPinDetail
  center: ILatLng
  zoom: number
  mapRef: React.RefObject<Map>
}
interface IState {}

class MapView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.handleMove = debounce(this.handleMove, 1000)
  }

  // on move end want to calculate current bounding box and notify parent
  // so that pins can be displayed as required
  private handleMove = () => {
    if (this.props.mapRef.current) {
      const boundingBox = this.props.mapRef.current.leafletElement.getBounds()
      const newBoundingBox: IBoundingBox = {
        topLeft: boundingBox.getNorthWest(),
        bottomRight: boundingBox.getSouthEast(),
      }
      this.props.onBoundingBoxChange(newBoundingBox)
    }
  }

  private pinClicked(pin) {
    this.props.onPinClicked(pin)
  }

  public render() {
    const { center, zoom, filters, pins, activePinDetail } = this.props
    return (
      <Map
        ref={this.props.mapRef}
        className="markercluster-map"
        center={[center.lat, center.lng]}
        zoom={zoom}
        maxZoom={18}
        style={{ height: '100%' }}
        onmove={this.handleMove}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Clusters pins={pins} onPinClick={pin => this.pinClicked(pin)} />
        <Popup map={this.props.mapRef} pinDetail={activePinDetail} />
      </Map>
    )
  }

  static defaultProps: Partial<IProps> = {
    onBoundingBoxChange: () => null,
    onPinClicked: () => null,
    pins: [],
    filters: [],
    center: { lat: 51.0, lng: 19.0 },
    zoom: 3,
  }
}

export { MapView }
