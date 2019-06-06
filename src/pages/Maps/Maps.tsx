import * as React from 'react'
import { withRouter, Route, Switch } from 'react-router'

import { Map, TileLayer, Marker } from 'react-leaflet'
import { MapView } from './Content/MapView'

import './styles.css'

interface IProps {}
interface IState {
  pins: Array<IMapPin>
}
import { IMapPin } from 'src/models/maps.models'

import { generatePins } from 'src/mocks/maps.mock'

class MapsPageClass extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      pins: generatePins(10000),
    }
  }

  private addItems() {
    console.log('add')
    this.setState({
      pins: this.state.pins.concat(generatePins(1000)),
    })
  }

  public render() {
    const { pins } = this.state
    return (
      <div id="MapPage" style={{ height: '100vh' }}>
        <Switch>
          <Route
            exact
            path="/maps"
            render={props => (
              <>
                <button
                  onClick={() => {
                    this.addItems()
                  }}
                >
                  Testing
                </button>
                <MapView pins={pins} />
              </>
            )}
          />
        </Switch>
      </div>
    )
  }
}

export const MapsPage = withRouter(MapsPageClass as any)
