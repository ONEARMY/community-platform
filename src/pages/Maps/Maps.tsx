import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter, Route, Switch } from 'react-router'

import { MapsStore } from 'src/stores/Maps/maps.store'
import { MapView, Controls } from './Content'
import { Box } from 'rebass'

import './styles.css'

import { ILatLng } from 'src/models/maps.models'
import { GetLocation } from 'src/utils/geolocation'
import { Map } from 'react-leaflet'

interface IProps {
  mapsStore: MapsStore
}
interface IState {
  center: ILatLng
  zoom: number
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
    }

    this.mapRef = React.createRef()
  }

  public async componentDidMount() {
    this.promptUserLocation()
    this.props.mapsStore.retrieveMapPins()
    this.props.mapsStore.retrievePinFilters()
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
    })
  }

  public render() {
    const {
      filteredPins,
      availablePinFilters,
      activePinFilters,
    } = this.props.mapsStore
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
                  availableFilters={availablePinFilters}
                  onFilterChange={(grouping, filters) =>
                    this.props.mapsStore.setActivePinFilters(grouping, filters)
                  }
                  onLocationChange={location => this.setCenter(location.latlng)}
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
