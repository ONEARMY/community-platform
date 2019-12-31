import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps, withRouter, Route, Switch } from 'react-router'

import { MapsStore } from 'src/stores/Maps/maps.store'
import { MapView, Controls } from './Content'
import { Box } from 'rebass'

import './styles.css'

import { ILatLng } from 'src/models/maps.models'
import { IUser } from 'src/models/user.models'
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
class MapsPageClass extends React.Component<IProps, IState> {
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
    if (!this.showPinFromURL()) {
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

  private showPinFromURL() {
    const pinId = this.props.location.hash.substr(1)
    if (pinId.length > 0) {
      this.props.mapsStore.getPin(pinId).then(pin => {
        if (typeof pin !== 'undefined') {
          this.props.mapsStore.setActivePin(pin)
          if (this.state.firstLoad) {
            this.setCenter(pin.location)
          }
        } else {
          // Should we do something in case we couldn't find requested pin?
        }
      })
      return true
    } else {
      return false
    }
  }

  public render() {
    const { filteredPins, activePinFilters } = this.props.mapsStore
    const { center, zoom } = this.state
    return (
      // the calculation for the height is kind of hacky for now, will set properly on final mockups
      <Box id="mapPage" sx={{ height: 'calc(100vh - 60px)' }}>
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
                  onLocationChange={location => this.setCenter(location.latlng)}
                  location={this.props.location}
                  match={this.props.match}
                  history={this.props.history}
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

export const MapsPage = withRouter(MapsPageClass as any)
