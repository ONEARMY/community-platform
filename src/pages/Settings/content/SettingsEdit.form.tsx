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
import Switch from '@material-ui/core/Switch'
import { inputStyles } from 'src/components/Form/elements'
import { FlagSelector } from 'src/components/Form/Select.field'
import { UserStore } from 'src/stores/User/user.store'
import { Button } from 'src/components/Button'
import { observer, inject } from 'mobx-react'
import { Flex, Box } from 'rebass'
import { getCountryCode } from 'src/utils/helpers'
import 'react-flags-select/scss/react-flags-select.scss'
import styled from 'styled-components'
import theme from 'src/themes/styled.theme'
import { FieldArray } from 'react-final-form-arrays'
import { Link } from './Link.field'
import { timestampToYear } from 'src/utils/helpers'
import { Icon } from 'src/components/Icons'
import { toJS } from 'mobx'
import { ILocation } from 'src/components/LocationSearch/LocationSearch'

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
  showYearSelector?: boolean
  showNotification?: boolean
  showComLinks?: boolean
}

// validation - return undefined if no error (i.e. valid)
const required = (value: any) => (value ? undefined : 'Required')

const FlagSelectContainer = styled(Flex)`
  border: 1px solid ${theme.colors.black};
  border-radius: 4px;
  height: 40px;
`

const YearBox = styled(Box)`
  ${inputStyles}
  cursor: pointer;
`

const HideShowBox = styled(Box)`
  opacity: ${props => (props.disabled ? 1 : 0.5)};
  pointer-events: ${props => (props.disabled ? undefined : 'none')};
`

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
      showYearSelector: false,
      showComLinks: user && user.links ? true : false,
    }
    this.changeComLinkSwitch = this.changeComLinkSwitch.bind(this)
  }

  public changeComLinkSwitch() {
    this.setState({ showComLinks: !this.state.showComLinks })
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

  public displayYear(dateOrTmstp) {
    // if date comes from db, it will be formated in firebase.Timestamp whereas if it comes from calendar (user modifications) it's a Date object
    // this fn check the type of the date and return a year in format YYYY
    if (dateOrTmstp instanceof Date && !isNaN(dateOrTmstp.valueOf())) {
      return dateOrTmstp.getFullYear()
    } else {
      return timestampToYear(dateOrTmstp.seconds)
    }
  }

  render() {
    const user = this.injected.userStore.user
    // Need to convert mobx observable user object into a Javasrcipt structure using toJS fn
    // to allow final-form-array to display the initial values
    const initialFormValues = toJS(user)

    return user ? (
      <Form
        // submission managed by button and state above
        onSubmit={values => this.saveProfile(values)}
        initialValues={initialFormValues}
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
                <Box mt={4}>
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
                        component={FlagSelector}
                        searchable={true}
                        defaultCountry={getCountryCode(user.country)}
                      />
                    </FlagSelectContainer>
                    <Text width={1} mt={2} medium>
                      Birth year :
                    </Text>
                    <YearBox
                      width={1}
                      onClick={() => {
                        this.setState({
                          showYearSelector: !this.state.showYearSelector,
                        })
                      }}
                    >
                      <Icon glyph={'arrow-down'} />
                      <Text inline ml={2}>
                        {user.year
                          ? this.displayYear(user.year)
                          : 'Choose a date'}
                      </Text>
                    </YearBox>
                    {this.state.showYearSelector && (
                      <Field
                        name="year"
                        component={YearPicker}
                        onChange={year => {
                          user.year = year
                          this.setState({ showYearSelector: false })
                        }}
                      />
                    )}
                  </Flex>
                  <Flex wrap={'nowrap'} alignItems={'center'} width={1}>
                    <Text medium>
                      Do you want to add communication links (Facebook, Discord,
                      Slack, Email ?)
                    </Text>
                    <Switch
                      checked={this.state.showComLinks}
                      onChange={this.changeComLinkSwitch}
                    />
                  </Flex>
                  <HideShowBox disabled={this.state.showComLinks}>
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
                  </HideShowBox>
                  <Text width={1} mt={2} medium>
                    About Me
                  </Text>
                  <Field
                    name="about"
                    component={TextAreaField}
                    placeholder="About"
                  />
                </Box>
              </form>
              {/* Map update separate to rest of form */}
            </>
          )
        }}
      />
    ) : null
  }
}
