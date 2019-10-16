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
  map: any
}
interface IState {}

class MapView extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.updateBoundingBox = debounce(this.updateBoundingBox.bind(this), 1000)
  }

  public componentDidMount() {
    this.updateBoundingBox()
  }

  private updateBoundingBox() {
    // Note - sometimes throws (current undefined). Workaround
    if (this.props.map && this.props.map.current) {
      const boundingBox = this.props.map.current.leafletElement.getBounds()
      const newBoundingBox: IBoundingBox = {
        topLeft: boundingBox._northEast,
        bottomRight: boundingBox._southWest,
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
        ref={this.props.map}
        className="markercluster-map"
        center={[center.lat, center.lng]}
        zoom={zoom}
        maxZoom={18}
        style={{ height: '100%' }}
        onMove={this.updateBoundingBox}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Clusters pins={pins} onPinClick={pin => this.pinClicked(pin)} />
        <Popup map={this.props.map} pinDetail={activePinDetail} />
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
