import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter, Switch, Route } from 'react-router'
import { MapStore } from 'src/stores/Map/map.store'
import { MapView } from './Content/MapView/MapView'
import { MAP_PINS } from 'src/mocks/map.mock'
import { LEGACY_PINS } from './Content/LegacyPins'
import {
  ILegacyMapPin,
  IMapPin,
  LegacyPinType,
  PinType,
} from 'src/models/map.model'
import { toTimestamp } from 'src/utils/helpers'

// see similar implementation in 'how-to' page for more detailed commenting
interface IProps {
  mapStore?: MapStore
}

@inject('mapStore')
@observer
class MapPageClass extends React.Component<IProps, any> {
  convertedLegacyPins: IMapPin[]
  constructor(props: any) {
    super(props)
    // just taking a subset of pins for early dev
    this.convertedLegacyPins = LEGACY_PINS.slice(0, 1000).map(p =>
      this.convertLegacyPin(p),
    )
  }

  public render() {
    // const allPins = this.props.mapStore!.allMapPins
    return (
      <div id="MapPage" style={{ height: '100%' }}>
        <Switch>
          <Route
            exact
            path="/map"
            render={props => (
              <MapView {...props} mapPins={this.convertedLegacyPins} />
            )}
          />
        </Switch>
      </div>
    )
  }

  // temp function to convert legacy pins into correct data format (when fully specified)
  private convertLegacyPin(p: ILegacyMapPin) {
    const pin: IMapPin = {
      _created: toTimestamp(p.created_date),
      _createdBy: p.username,
      _deleted: false,
      _id: p.ID,
      _modified: toTimestamp(p.created_date),
      location: {
        lat: p.lat,
        lng: p.lng,
        country: 'TODO',
        countryCode: 'TODO',
        name: 'TODO',
      },
      type: this.convertLegacyPinType(p.filters[0] as LegacyPinType),
    }
    return pin
  }

  private convertLegacyPinType(type: LegacyPinType): PinType {
    switch (type) {
      case 'STARTED':
        return 'wants_to_get_started'
      case 'WORKSHOP':
        return 'workspace'
      case 'MACHINE':
        return 'machine_builder'
      case 'Machine ':
        return 'machine_builder'
      default:
        throw new Error(`unknown pin type [${type}]`)
    }
  }
}
export const MapPage = withRouter(MapPageClass as any)
