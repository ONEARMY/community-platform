import * as React from 'react'
import { withRouter, Route, Switch } from 'react-router'

import { Map, TileLayer, Marker } from 'react-leaflet'
import { MapView } from './Content/MapView'

import './styles.css'

import { IMapPin, PinType } from 'src/models/maps.models'

const defaultFilters: Array<PinType> = [
  'injector',
  'shredder',
  'extruder',
  'press',
  'research',
  'member',
  'community',
  'builder',
]

interface IProps {}
interface IState {
  pins: Array<IMapPin>
  pinFilters: Array<PinType>
}

import { generatePins } from 'src/mocks/maps.mock'

class MapsPageClass extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      pins: generatePins(10000),
      pinFilters: defaultFilters,
    }
  }

  private addItems() {
    console.log('add')
    this.setState({
      pins: this.state.pins.concat(generatePins(1000)),
    })
  }

  private popFilter() {
    const { pinFilters } = this.state
    pinFilters.pop()
    this.setState({ pinFilters })
  }

  public render() {
    const { pins, pinFilters } = this.state
    const filteredPins = pins.filter(pin => pinFilters.includes(pin.pinType))
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
                <button
                  onClick={() => {
                    this.popFilter()
                  }}
                >
                  PopFilter
                </button>
                <MapView pins={filteredPins} />
              </>
            )}
          />
        </Switch>
      </div>
    )
  }
}

export const MapsPage = withRouter(MapsPageClass as any)
