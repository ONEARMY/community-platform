import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter, Route, Switch } from 'react-router'

import { MapsStore } from 'src/stores/Maps/maps.store'

import { Map, TileLayer, Marker } from 'react-leaflet'
import { MapView, Controls } from './Content'

import './styles.css'

import { IMapPin, IPinType, ILatLng } from 'src/models/maps.models'

interface IProps {
  mapsStore: MapsStore
}
interface IState {
  center: ILatLng
  zoom: number
}

import { generatePins } from 'src/mocks/maps.mock'

@inject('mapsStore')
@observer
class MapsPageClass extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      center: { lat: 51.0, lng: 19.0 },
      zoom: 4,
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
      <div id="MapPage" style={{ height: '100vh' }}>
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
      </div>
    )
  }
}

export const MapsPage = withRouter(MapsPageClass as any)
