import * as React from 'react'
import { observer, inject } from 'mobx-react'
import Heading from 'src/components/Heading'
import { Button } from 'src/components/Button'
import { BoxContainer } from 'src/components/Layout/BoxContainer'
import {
  ILocation,
  LocationSearch,
} from 'src/components/LocationSearch/LocationSearch'
import { MapsStore } from 'src/stores/Maps/maps.store'
import { UserStore } from 'src/stores/User/user.store'
import { MapView } from 'src/pages/Maps/Content'
import { IMapPin, IPinType, IMapPinDetail } from 'src/models/maps.models'
import { IUser } from 'src/models/user.models'

interface IProps {}
interface IInjectedProps extends IProps {
  mapsStore: MapsStore
  userStore: UserStore
}
interface IState {
  userPin?: IMapPin
  activePinDetail?: IMapPinDetail
}

const DEFAULT_PIN_TYPE: IPinType = {
  grouping: 'individual',
  displayName: 'Member',
  name: 'member',
  icon: '',
  count: 0,
}

@inject('mapsStore', 'userStore')
@observer
export class UserMapPinEdit extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    this.loadUserPin()
  }
  get injected() {
    return this.props as IInjectedProps
  }
  get user() {
    return this.injected.userStore.user as IUser
  }

  private async saveUserPin() {
    console.log('saving pin', this.state.userPin)
    await this.injected.mapsStore.setPin(this.state.userPin!)
  }

  // update map preview and automatically save pin on location change
  private onLocationChange(location: ILocation) {
    const pin = this.generateUserPin(location)
    this.setState({
      userPin: pin,
    })
    this.saveUserPin()
  }

  // Map pin only stores a small amount of user data (id, address)
  // Rest is pulled from user profile, and kept independent of map pin datapoint
  // So that data only needs to be kept fresh in one place (i.e. not have user.location in profile)
  private generateUserPin(location: ILocation): IMapPin {
    const { lat, lng } = location.latlng
    const address = location.value
    return {
      id: this.user.userName,
      location: { lat, lng, address },
      // TODO - give proper options for pin type and pass
      pinType: DEFAULT_PIN_TYPE,
    }
  }

  // load existing user pin from database (used on first load)
  private async loadUserPin() {
    const userPin = (await this.injected.mapsStore.getPin(
      this.user.userName,
    )) as unknown
    console.log('userPin', userPin)
    // use unknown type to allow rebase of IMapDatabasePin -> IMapPin
    this.setState({ userPin: userPin as IMapPin })
  }

  render() {
    const pin = this.state.userPin
    return (
      <BoxContainer id="your-map-pin" mt={4}>
        <Heading small bold>
          Your map pin
        </Heading>
        <div style={{ position: 'relative', zIndex: 2 }}>
          LocationSearch
          <LocationSearch onChange={v => this.onLocationChange(v)} />
        </div>
        {/* wrap both above and below in positioned div to ensure location search box appears above map */}
        <div style={{ height: '300px', position: 'relative', zIndex: 1 }}>
          <MapView
            zoom={pin ? 13 : 2}
            center={pin ? pin.location : undefined}
            pins={pin ? [pin] : []}
            filters={[DEFAULT_PIN_TYPE]}
            // TODO - popup not currently shown as doesn't update correctly
            // activePinDetail={this.state.activePinDetail}
            // onPinClicked={() => this.getActivePinDetail()}
          />
        </div>
      </BoxContainer>
    )
  }
}
