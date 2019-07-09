import * as React from 'react'
import { Form, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import Heading from 'src/components/Heading'
import { IUser } from 'src/models/user.models'
import Text from 'src/components/Text'
import {
  InputField,
  TextAreaField,
  YearPicker,
} from 'src/components/Form/Fields'
import { FlagSelector } from 'src/components/Form/Select.field'
import { UserStore } from 'src/stores/User/user.store'
import { Button } from 'src/components/Button'
import { observer, inject } from 'mobx-react'
import { Flex, Box } from 'rebass'
import { BoxContainer } from 'src/components/Layout/BoxContainer'
import { getCountryCode } from 'src/utils/helpers'
import 'react-flags-select/scss/react-flags-select.scss'
import styled from 'styled-components'
import theme from 'src/themes/styled.theme'

import { Map, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LocationSearchField } from 'src/components/Form/LocationSearch.field'
import { FieldArray } from 'react-final-form-arrays'
import { Link } from './Link.field'

interface IFormValues extends Partial<IUser> {
  // form values are simply subset of user profile fields
}
interface IProps {
  onProfileSave: () => void
}
interface IInjectedProps extends IProps {
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

// validation - return undefined if no error (i.e. valid)
const required = (value: any) => (value ? undefined : 'Required')

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
export class SettingsEditForm extends React.Component<IProps, IState> {
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
    console.log('profile values :', values)
    this.props.onProfileSave()

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

  public onLocationChange(v) {
    this.setState({ lat: v.latlng.lat, lng: v.latlng.lng, zoom: 15 })
  }

  render() {
    const user = this.injected.userStore.user
    const { lat, lng, zoom } = this.state

    return user ? (
      <Form
        // submission managed by button and state above
        onSubmit={values => this.saveProfile(values)}
        initialValues={user}
        validateOnBlur
        mutators={{
          ...arrayMutators,
        }}
        render={({ handleSubmit, submitting, values }) => {
          return (
            <>
              {/* NOTE - need to put submit method on form to prevent
              default post request */}
              <form id="userProfileForm" onSubmit={handleSubmit}>
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
                      <Field
                        name="country"
                        validate={required}
                        validateFields={[]}
                        component={FlagSelector}
                        searchable={true}
                        defaultCountry={getCountryCode(user.country)}
                      />
                    </FlagSelectContainer>
                    <Text width={1} mt={2} medium>
                      Birth year :
                    </Text>
                    <Field
                      name="year"
                      validateFields={[]}
                      component={YearPicker}
                    />
                  </Flex>
                  <Text width={1} mt={4} medium>
                    Do you want to add communication links (Facebook, Discord,
                    Slack, Email ?)
                  </Text>
                  <FieldArray name="links">
                    {({ fields }) => (
                      <>
                        {fields.map((name, index: number) => (
                          <Link
                            key={index}
                            link={name}
                            index={index}
                            onDelete={(fieldIndex: number) => {
                              fields.remove(fieldIndex)
                            }}
                          />
                        ))}
                        <Button
                          my={2}
                          variant="outline"
                          onClick={() => {
                            fields.push({
                              label: '',
                              url: '',
                            })
                          }}
                        >
                          add another
                        </Button>
                      </>
                    )}
                  </FieldArray>
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
                  <Field
                    name={user ? `${user.location!.value}` : 'location'}
                    validateFields={[]}
                    customChange={v => this.onLocationChange(v)}
                    component={LocationSearchField}
                  />
                  <Map
                    center={
                      user.location
                        ? [user.location.latlng.lat, user.location.latlng.lng]
                        : [lat, lng]
                    }
                    zoom={zoom}
                    zoomControl={false}
                    style={{
                      height: '300px',
                      zIndex: 1,
                    }}
                  >
                    <ZoomControl position="topright" />
                    <TileLayer
                      attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      position={
                        user.location
                          ? [user.location.latlng.lat, user.location.latlng.lng]
                          : [lat, lng]
                      }
                      icon={customMarker}
                    >
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
