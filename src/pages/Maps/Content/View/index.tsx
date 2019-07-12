import * as React from 'react'
import { toJS } from 'mobx'
import debounce from 'debounce'
import L from 'leaflet'
import { Map, TileLayer } from 'react-leaflet'

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
} from 'src/models/maps.models'

interface IProps {
  pins: Array<IMapPin>
  filters: Array<IPinType>
  onBoundingBoxChange: (boundingBox: IBoundingBox) => void
  onPinClicked: (pin: IMapPin) => void
  activePinDetail?: IMapPin | IMapPinDetail
  center: ILatLng
  zoom: number
}
interface IState {}

class MapView extends React.Component<IProps, IState> {
  private map

  constructor(props) {
    super(props)
    this.map = React.createRef()
    this.updateBoundingBox = debounce(this.updateBoundingBox.bind(this), 1000)
  }

  public componentDidMount() {
    this.updateBoundingBox()
  }

  private updateBoundingBox() {
    const boundingBox = this.map.current.leafletElement.getBounds()
    const newBoundingBox: IBoundingBox = {
      topLeft: boundingBox._northEast,
      bottomRight: boundingBox._southWest,
    }
    this.props.onBoundingBoxChange(newBoundingBox)
  }

  private pinClicked(pin) {
    this.props.onPinClicked(pin)
  }

  public render() {
    const { center, zoom, filters, pins, activePinDetail } = this.props
    const mapFilters = filters.map(filter => filter.name)
    const mapPins = pins.filter(pin => mapFilters.includes(pin.pinType.name))

    return (
      <Map
        ref={this.map}
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
        <Clusters pins={mapPins} onPinClick={pin => this.pinClicked(pin)} />
        <Popup map={this.map} pinDetail={activePinDetail} />
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
