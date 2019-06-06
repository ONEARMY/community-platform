import * as React from 'react'
import L from 'leaflet'
import { Map, TileLayer } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'

import { getClustersFromPins } from './Cluster'

import { IMapPin } from 'src/models/maps.models'
interface IProps {
  pins: Array<IMapPin>
}
interface IState {}

class MapView extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
  }

  public render() {
    return (
      <Map
        className="markercluster-map"
        center={[51.0, 19.0]}
        zoom={4}
        maxZoom={18}
        style={{ height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <div>Testing</div>
        {getClustersFromPins(this.props.pins)}
      </Map>
    )
  }
}

export { MapView }
