import * as React from 'react'
import { Form, Field } from 'react-final-form'
import Heading from 'src/components/Heading'
import { IUser } from 'src/models/user.models'
import Text from 'src/components/Text'
import { InputField, TextAreaField } from 'src/components/Form/Fields'
import { UserStore } from 'src/stores/User/user.store'
import { Button } from 'src/components/Button'
import { TextNotification } from 'src/components/Notification/TextNotification'
import { observer, inject } from 'mobx-react'
import { Flex, Box } from 'rebass'
import { BoxContainer } from 'src/components/Layout/BoxContainer'
import ReactFlagsSelect from 'react-flags-select'
import countries from 'react-flags-select/lib/countries.js'
import 'react-flags-select/scss/react-flags-select.scss'
import styled from 'styled-components'
import theme from 'src/themes/styled.theme'
import Selector from 'src/components/Selector'
import COM_TYPE_MOCK from 'src/mocks/communicationSelector.mock'

import { Map, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface IFormValues extends Partial<IUser> {
  // form values are simply subset of user profile fields
}
interface IProps {
  // no additional props here
}
interface IInjectedProps {
  userStore: UserStore
}
interface IState {
  formValues: IFormValues
  readOnly: boolean
  isSaving?: boolean
  showNotification?: boolean
  lat: number
  lng: number
  zoom: number
}

const FlagSelectContainer = styled(Flex)`
  border: 1px solid ${theme.colors.black};
  border-radius: 4px;
  height: 40px;
`

const customMarker = L.icon({
  iconUrl: require('src/assets/icons/map-marker.png'),
  iconSize: [20, 28],
  iconAnchor: [20, 56],
})

// we inject the userstore here instead of passing down as would have to pass
// from Profile -> UserProfile -> ProfileEditForm which is less reliable
// could use contextAPI but as we have mobx feels easier
@inject('userStore')
@observer
export class ProfileEditForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    const user = this.injected.userStore.user
    this.state = {
      formValues: user ? user : {},
      readOnly: true,
      lat: 51.4416,
      lng: 5.4697,
      zoom: 8,
    }
  }

  get injected() {
    return this.props as IInjectedProps
  }

  public async saveProfile(values: IFormValues) {
    await this.injected.userStore.updateUserProfile(values)
    this.setState({ readOnly: true, showNotification: true })
  }

  public countryChange() {
    console.log('country change')
  }
  public onChangeYear() {
    console.log('year change')
  }
  public onChangeMonth() {
    console.log('month change')
  }

  public getCountryCode(countryName: string | undefined) {
    return Object.keys(countries).find(key => countries[key] === countryName)
  }

  render() {
    const user = this.injected.userStore.user
    const { lat, lng, zoom } = this.state

    return user ? (
      <Form
        // submission managed by button and state above
        onSubmit={values => this.saveProfile(values)}
        initialValues={user}
        render={({ handleSubmit, submitting }) => {
          return (
            <>
              {this.state.readOnly && (
                <div style={{ float: 'right' }}>
                  <Button
                    variant={'outline'}
                    m={0}
                    icon={'edit'}
                    onClick={() => this.setState({ readOnly: false })}
                  >
                    Edit Profile
                  </Button>
                  <TextNotification
                    text="profile saved"
                    icon="check"
                    show={this.state.showNotification}
                  />
                </div>
              )}
              {/* NOTE - need to put submit method on form to prevent
              default post request */}
              <form onSubmit={handleSubmit}>
                {!this.state.readOnly && (
                  <Button
                    variant={submitting ? 'disabled' : 'outline'}
                    m={0}
                    icon={'check'}
                    style={{ float: 'right' }}
                    disabled={submitting}
                    type="submit"
                  >
                    Save Profile
                  </Button>
                )}
                <BoxContainer mt={4}>
                  <Heading small bold>
                    Your infos
                  </Heading>
                  <Flex width={1 / 2} flexWrap={'wrap'}>
                    <Field
                      name="userName"
                      component={InputField}
                      placeholder="User Name"
                    />
                    <FlagSelectContainer width={1} alignItems="center">
                      <ReactFlagsSelect
                        searchable={true}
                        defaultCountry={this.getCountryCode(user.country)}
                        onSelect={this.countryChange}
                      />
                    </FlagSelectContainer>
                    <Text width={1} mt={2} medium>
                      Birth year :
                    </Text>
                    <Field
                      name="date"
                      validateFields={[]}
                      // validate={required}
                      component={InputField}
                      onBlur={this.onChangeYear}
                      type="date"
                    />
                  </Flex>
                  <Text width={1} mt={4} medium>
                    Do you want to add communication links (Facebook, Discord,
                    Slack, Email ?)
                  </Text>
                  <Flex>
                    <Selector
                      list={COM_TYPE_MOCK}
                      width={[1 / 5]}
                      my={2}
                      mr={2}
                    />
                    <Field
                      name="communication"
                      component={InputField}
                      placeholder="Link"
                    />
                  </Flex>
                  <Button variant="outline">add another</Button>
                </BoxContainer>
                <BoxContainer mt={4}>
                  <Heading small bold>
                    Your map pin
                  </Heading>
                  <Field
                    name="about"
                    component={TextAreaField}
                    placeholder="About"
                  />
                  <Map
                    center={[lat, lng]}
                    zoom={zoom}
                    zoomControl={false}
                    style={{
                      height: '300px',
                    }}
                  >
                    <ZoomControl position="topright" />
                    <TileLayer
                      attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[lat, lng]} icon={customMarker}>
                      <Popup maxWidth={225} minWidth={225}>
                        Add more content here later
                      </Popup>
                    </Marker>
                  </Map>
                </BoxContainer>
              </form>
            </>
          )
        }}
      />
    ) : null
  }
}
