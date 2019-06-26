import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter, Route, Switch } from 'react-router'

import { MapsStore } from 'src/stores/Maps/maps.store'

import { Map, TileLayer, Marker } from 'react-leaflet'
import { MapView } from './Content/MapView'
import { Controls } from './Content/Controls'

import './styles.css'

import { IMapPin, IPinType } from 'src/models/maps.models'

interface IProps {
  mapsStore: MapsStore
}
interface IState {}

import { generatePins } from 'src/mocks/maps.mock'

@inject('mapsStore')
@observer
class MapsPageClass extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)
    this.setFilters = this.setFilters.bind(this)
  }

  public async componentDidMount() {
    this.props.mapsStore.retrieveMapPins()
    this.props.mapsStore.retrievePinFilters()
  }

  private setFilters() {
    const { activePinFilters } = this.props.mapsStore
    this.props.mapsStore.setActivePinFilters(activePinFilters.slice(1))
  }

  private setLocation(location) {
    // TODO: change the center of the map
  }

  public render() {
    const {
      mapPins,
      availablePinFilters,
      activePinFilters,
    } = this.props.mapsStore
    return (
      <div id="MapPage" style={{ height: '100vh' }}>
        <Switch>
          <Route
            exact
            path="/maps"
            render={props => (
              <>
                <Controls
                  availableFilters={availablePinFilters}
                  setFilters={this.setFilters}
                  onLocationChange={this.setLocation}
                />
                <MapView pins={mapPins} filters={activePinFilters} />
              </>
            )}
          />
        </Switch>
      </div>
    )
  }
}

export const MapsPage = withRouter(MapsPageClass as any)
