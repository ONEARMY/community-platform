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

interface IProps {}
interface IInjectedProps extends IProps {
  mapsStore: MapsStore
  userStore: UserStore
}
interface IState {
  userPin?: IMapPin
  pinDetail?: IMapPinDetail
}

const DEFAULT_PIN_TYPE: IPinType = {
  grouping: 'individual',
  displayName: 'Member',
  name: 'member',
  icon: '',
  count: 0,
}
const DEFAULT_PIN_DETAIL: any = {
  name: 'Test',
  shortDescription: 'A short description',
  lastActive: new Date(),
  profilePicUrl: '',
  profileUrl: '',
  heroImageUrl: '',
}

@inject('mapsStore', 'userStore')
@observer
export class UserMapPin extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {}
  }
  get injected() {
    return this.props as IInjectedProps
  }

  componentDidMount() {
    console.log('component did mount', this.injected.userStore.user!._id)
  }
  private async _subscribeToUserPin() {
    // TODO
  }

  private async setPinDetail() {
    // TODO
  }

  private async saveUserPin() {
    await this.injected.mapsStore.setPin(this.state.userPin!)
  }

  private onLocationChange(location: ILocation) {
    const { lat, lng } = location.latlng
    const address = location.value
    const pin: IMapPin = {
      id: this.injected.userStore.user!.userName,
      location: { lat, lng, address },
      // TODO - give proper options for pin type and pass
      pinType: DEFAULT_PIN_TYPE,
    }
    this.setState({
      userPin: pin,
      pinDetail: { ...DEFAULT_PIN_DETAIL, ...pin },
    })
  }

  render() {
    const pin = this.state.userPin
    const buttonVariant = location ? 'outline' : 'disabled'
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
            activePinDetail={this.state.pinDetail}
          />
        </div>
        <Button
          my={2}
          icon="add"
          variant={buttonVariant}
          onClick={() => {
            this.saveUserPin()
          }}
        >
          Save Map Pin
        </Button>
      </BoxContainer>
    )
  }
}
