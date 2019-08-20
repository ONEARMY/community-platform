import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter, Route, Switch } from 'react-router'

import { MapsStore } from 'src/stores/Maps/maps.store'
import { MapView, Controls } from './Content'
import { Box } from 'rebass'

import './styles.css'

import { IMapPin, IPinType, ILatLng } from 'src/models/maps.models'

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
  constructor(props: any) {
    super(props)
    this.state = {
      center: { lat: 50.95194, lng: 1.85635 },
      zoom: 8,
    }
  }

  public async componentDidMount() {
    this.props.mapsStore.retrieveMapPins()
    this.props.mapsStore.retrievePinFilters()
  }

  private setCenter(location) {
    this.setState({
      center: location.latlng as ILatLng,
      zoom: 11,
    })
  }

  public render() {
    const {
      mapPins,
      availablePinFilters,
      activePinFilters,
      pinDetail,
    } = this.props.mapsStore

    const { center, zoom } = this.state

    return (
      // the calculation for the height is kind of hacky for now, will set properly on final mockups
      <Box
        id="mapPage"
        style={{ height: 'calc(100vh - 60px)' }}
        mx={[-2, -3, -4]}
      >
        <Switch>
          <Route
            exact
            path="/map"
            render={props => (
              <>
                <Controls
                  availableFilters={availablePinFilters}
                  onFilterChange={(grouping, filters) =>
                    this.props.mapsStore.setActivePinFilters(grouping, filters)
                  }
                  onLocationChange={location => this.setCenter(location)}
                />
                <MapView
                  pins={mapPins}
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
