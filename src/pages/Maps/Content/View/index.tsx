import * as React from 'react'
import debounce from 'debounce'
import { Map, TileLayer } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import './index.css'

import { Clusters } from './Cluster'
import { Popup } from './Popup'

import type {
  IMapPin,
  ILatLng,
  IBoundingBox,
  IMapGrouping,
} from 'src/models/maps.models'
import { inject, observer } from 'mobx-react'
import type { MapsStore } from 'src/stores/Maps/maps.store'
import type { RouteComponentProps } from 'react-router'
import { toJS } from 'mobx'
import type { LatLngExpression } from 'leaflet'

interface IProps extends RouteComponentProps<any> {
  pins: Array<IMapPin>
  filters: Array<IMapGrouping>
  onBoundingBoxChange: (boundingBox: IBoundingBox) => void
  onPinClicked: (pin: IMapPin) => void
  center: ILatLng
  zoom: number
  mapRef: React.RefObject<Map>
}
interface IInjectedProps extends IProps {
  mapsStore: MapsStore
}

@inject('mapsStore')
@observer
class MapView extends React.Component<IProps> {
  // on move end want to calculate current bounding box and notify parent
  static defaultProps: Partial<IProps> = {
    onBoundingBoxChange: () => null,
    onPinClicked: () => null,
    pins: [],
    filters: [],
    center: { lat: 51.0, lng: 19.0 },
    zoom: 3,
  }
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
  constructor(props: IProps) {
    super(props)
    this.handleMove = debounce(this.handleMove, 1000)
  }

  get injected() {
    return this.props as IInjectedProps
  }
  componentDidMount() {
    if (this.props.mapRef.current) {
      return this.props.mapRef.current.leafletElement.zoomControl?.setPosition(
        'bottomleft',
      )
    }
  }

  private async pinClicked(pin: IMapPin) {
    await this.injected.mapsStore.setActivePin(pin)
    this.props.history.push('/map#' + pin._id)
  }

  public render() {
    const { center, zoom, pins } = this.props
    const { activePin } = this.injected.mapsStore
    const isViewportGreaterThanTablet = window.innerWidth > 1024

    const mapCenter: LatLngExpression = center
      ? [center.lat, center.lng]
      : [0, 0]
    const mapZoom = center ? zoom : 2

    return (
      <Map
        ref={this.props.mapRef}
        className="markercluster-map"
        center={mapCenter}
        zoom={mapZoom}
        maxZoom={18}
        zoomControl={isViewportGreaterThanTablet}
        style={{ height: '100%', zIndex: 0 }}
        onmove={this.handleMove}
        onclick={() => {
          this.injected.mapsStore.setActivePin(undefined)
          this.props.history.push('/map')
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
        />
        <Clusters pins={pins} onPinClick={(pin) => this.pinClicked(pin)} />
        {activePin && this.injected.mapsStore.canSeePin(activePin) && (
          // NOTE CC - 2021-07-06 mobx update no longer passing JS object, but observable that needs converting
          <Popup activePin={toJS(activePin)} map={this.props.mapRef} />
        )}
      </Map>
    )
  }
}

export { MapView }
