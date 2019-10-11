import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter, Route, Switch } from 'react-router'

import { MapsStore } from 'src/stores/Maps/maps.store'
import { MapView, Controls } from './Content'
import { Box } from 'rebass'

import './styles.css'

import { ILatLng } from 'src/models/maps.models'

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
  map: any

  constructor(props: any) {
    super(props)
    this.state = {
      center: { lat: 51.0, lng: 19.0 },
      zoom: 3,
    }
    this.map = React.createRef()
  }

  public async componentDidMount() {
    this.props.mapsStore.retrieveMapPins()
    this.props.mapsStore.retrievePinFilters()
  }

  public async componentWillUnmount() {
    this.props.mapsStore.removeSubscriptions()
  }

  private setCenter(location) {
    this.setState({
      center: location.latlng as ILatLng,
      zoom: 8,
    })
  }

  public render() {
    const {
      filteredPins,
      availablePinFilters,
      activePinFilters,
      pinDetail,
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
                  map={this.map}
                  availableFilters={availablePinFilters}
                  onFilterChange={(grouping, filters) =>
                    this.props.mapsStore.setActivePinFilters(grouping, filters)
                  }
                  onLocationChange={location => this.setCenter(location)}
                />
                <MapView
                  map={this.map}
                  pins={filteredPins}
                  filters={activePinFilters}
                  onBoundingBoxChange={boundingBox =>
                    this.props.mapsStore.setMapBoundingBox(boundingBox)
                  }
                  onPinClicked={pin => this.props.mapsStore.getPinDetails(pin)}
                  activePinDetail={pinDetail}
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
