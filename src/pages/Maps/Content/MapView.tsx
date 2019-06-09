import * as React from 'react'
import debounce from 'debounce'
import L from 'leaflet'
import { Map, TileLayer } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'

import { getClustersFromPins } from './Cluster'

import { IMapPin, ILatLng, IBoundingBox } from 'src/models/maps.models'
interface IProps {
  pins: Array<IMapPin>
}
interface IState {
  boundingBox: IBoundingBox
}

class MapView extends React.Component<IProps, IState> {
  private map

  constructor(props) {
    super(props)
    this.state = {
      boundingBox: {
        topLeft: { lat: -90, lng: -180 },
        bottomRight: { lat: 90, lng: 180 },
      },
    }
    this.map = React.createRef()
    this.updateBoundingBox = debounce(this.updateBoundingBox.bind(this), 1000)
  }

  public componentDidMount() {
    this.updateBoundingBox()
  }

  private updateBoundingBox() {
    // @ts-ignore
    const boundingBox = this.map.current.leafletElement.getBounds()
    const newBoundingBox: IBoundingBox = {
      topLeft: boundingBox._northEast,
      bottomRight: boundingBox._southWest,
    }
    this.setState({ boundingBox: newBoundingBox })
  }

  public render() {
    const things = getClustersFromPins(this.props.pins, this.state.boundingBox)
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
        {things}
      </Map>
    )
  }
}

export { MapView }
