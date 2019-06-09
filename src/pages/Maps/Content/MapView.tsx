import * as React from 'react'
import debounce from 'debounce'
import L from 'leaflet'
import { Map, TileLayer } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'

import { Clusters } from './Cluster'

import { IMapPin, ILatLng, IBoundingBox, PinType } from 'src/models/maps.models'
interface IProps {
  pins: Array<IMapPin>
}
interface IState {
  boundingBox: IBoundingBox
  pinFilters: Array<PinType>
}

const defaultFilters: Array<PinType> = [
  'injector',
  'shredder',
  'extruder',
  'press',
  'research',
  'member',
  'community',
  'builder',
]

class MapView extends React.Component<IProps, IState> {
  private map

  constructor(props) {
    super(props)
    this.state = {
      boundingBox: {
        topLeft: { lat: -90, lng: -180 },
        bottomRight: { lat: 90, lng: 180 },
      },
      pinFilters: defaultFilters,
    }
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
    this.setState({ boundingBox: newBoundingBox })
  }

  private updateFilters() {
    const { pinFilters } = this.state
    pinFilters.pop()
    this.setState({ pinFilters })
  }

  public render() {
    return (
      <Map
        ref={this.map}
        className="markercluster-map"
        center={[51.0, 19.0]}
        zoom={4}
        maxZoom={18}
        style={{ height: '100%' }}
        onMove={this.updateBoundingBox}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <div>Testing</div>
        <Clusters pins={this.props.pins} boundingBox={this.state.boundingBox} />
      </Map>
    )
  }
}

export { MapView }
