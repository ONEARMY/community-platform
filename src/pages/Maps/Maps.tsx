import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps, withRouter, Route, Switch } from 'react-router'

import { MapsStore } from 'src/stores/Maps/maps.store'
import { MapView, Controls } from './Content'
import { Box } from 'rebass'

import './styles.css'

import { ILatLng } from 'src/models/maps.models'
import { GetLocation } from 'src/utils/geolocation'
import { Map } from 'react-leaflet'
import { MAP_GROUPINGS } from 'src/stores/Maps/maps.groupings'

interface IProps extends RouteComponentProps<any> {
  mapsStore: MapsStore
}
interface IState {
  center: ILatLng
  zoom: number
  firstLoad: boolean
}

@inject('mapsStore')
@observer
class MapsPage extends React.Component<IProps, IState> {
  mapRef: React.RefObject<Map>

  constructor(props: any) {
    super(props)
    this.state = {
      center: { lat: 51.0, lng: 19.0 },
      zoom: 3,
      firstLoad: true,
    }

    this.mapRef = React.createRef()
  }

  public async componentDidMount() {
    this.props.mapsStore.retrieveMapPins()
    this.props.mapsStore.retrievePinFilters()
    await this.showPinFromURL()
    if (!this.props.mapsStore.activePin) {
      this.promptUserLocation()
    }
  }

  public async componentDidUpdate(prevProps) {
    if (this.props.location.hash !== prevProps.location.hash) {
      this.showPinFromURL()
    }
  }

  public async componentWillUnmount() {
    this.props.mapsStore.removeSubscriptions()
    this.props.mapsStore.setActivePin(undefined)
  }

  private async promptUserLocation() {
    try {
      const position = await GetLocation()
      this.setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    } catch (error) {
      console.error(error)
      // do nothing if location cannot be retrieved
    }
  }

  private setCenter(latlng: ILatLng) {
    this.setState({
      center: latlng as ILatLng,
      zoom: 8,
      firstLoad: false,
    })
  }

  /** Check current hash in case matches a mappin and try to load */
  private async showPinFromURL() {
    const pinId = this.props.location.hash.substr(1)
    // Only lookup if not already the active pin
    if (pinId && pinId !== this.props.mapsStore.activePin?._id) {
      const pin = await this.props.mapsStore.getPin(pinId)
      this.props.mapsStore.setActivePin(pin)
    }
    // Center on the pin if first load
    if (this.state.firstLoad && this.props.mapsStore.activePin) {
      this.setCenter(this.props.mapsStore.activePin.location)
    }
    // TODO - handle pin not found
  }

  public render() {
    const { filteredPins, activePinFilters } = this.props.mapsStore
    const { center, zoom } = this.state
    return (
      // the calculation for the height is kind of hacky for now, will set properly on final mockups
      <Box id="mapPage" sx={{ height: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route
            exact
            path="/map"
            render={props => (
              <>
                <Controls
                  mapRef={this.mapRef}
                  availableFilters={MAP_GROUPINGS}
                  onFilterChange={selected => {
                    this.props.mapsStore.setActivePinFilters(selected)
                  }}
                  onLocationChange={latlng => this.setCenter(latlng)}
                  {...props}
                />
                <MapView
                  mapRef={this.mapRef}
                  pins={filteredPins}
                  filters={activePinFilters}
                  onBoundingBoxChange={boundingBox =>
                    this.props.mapsStore.setMapBoundingBox(boundingBox)
                  }
                  center={center}
                  zoom={zoom}
                  history={this.props.history}
                />
              </>
            )}
          />
        </Switch>
      </Box>
    )
  }
}

export default withRouter(MapsPage as any)
