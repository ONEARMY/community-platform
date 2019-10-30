import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Form, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import TEMPLATE from './Template'
import { UploadedFile } from 'src/pages/common/UploadedFile/UploadedFile'
import { InputField } from 'src/components/Form/Fields'
import { Button } from 'src/components/Button'
import { EventStore } from 'src/stores/Events/events.store'
import Heading from 'src/components/Heading'
import Flex from 'src/components/Flex'
import { TagsSelectField } from 'src/components/Form/TagsSelect.field'
import { inject } from 'mobx-react'
import { PostingGuidelines } from './PostingGuidelines'
import { IEvent, IEventFormInput } from 'src/models/events.models'
import { LocationSearchField } from 'src/components/Form/LocationSearch.field'
import styled from 'styled-components'
import theme from 'src/themes/styled.theme'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './EventsCreate.css'

interface IState {
  formValues: IEventFormInput
  formSaved: boolean
  showSubmitModal?: boolean
  selectedDate: any
}
interface IProps extends RouteComponentProps<any> {}
interface IInjectedProps extends IProps {
  eventStore: EventStore
}

// validation - return undefined if no error (i.e. valid)
const required = (value: any) => (value ? undefined : 'Required')

const FormContainer = styled.form`
  width: 100%;
`

const Label = styled.label`
  font-size: ${theme.fontSizes[2] + 'px'};
  margin-bottom: ${theme.space[2] + 'px'};
`

@inject('eventStore')
export class EventsCreate extends React.Component<IProps, IState> {
  uploadRefs: { [key: string]: UploadedFile | null } = {}
  constructor(props: any) {
    super(props)
    // generate unique id for db and storage references and assign to state
    this.state = {
      formValues: { ...TEMPLATE.INITIAL_VALUES },
      formSaved: false,
      selectedDate: null,
    }
  }

  get injected() {
    return this.props as IInjectedProps
  }
  get store() {
    return this.injected.eventStore
  }

  public onSubmit = async (formValues: IEventFormInput) => {
    console.log('form values', formValues)
    await this.store.uploadEvent(formValues)
    this.props.history.push('/events')
  }

  public validateTitle = async (value: any) => {
    return this.store.validateTitle(value, 'v2_events')
  }

  public validateUrl = async (value: any) => {
    return this.store.validateUrl(value)
  }

  handleChange = (date: any) => {
    this.setState({
      selectedDate: date,
    })
  }

  public render() {
    const { formValues } = this.state
    return (
      <Form
        onSubmit={v => {
          const datepickerDate = this.state.selectedDate
          // convert from Date type to yyyy/mm/dd string and back into local timezone
          const convert = new Date(
            datepickerDate.getTime() -
              datepickerDate.getTimezoneOffset() * 60000,
          )
            .toISOString()
            .substring(0, 10)
          v.date = convert
          this.onSubmit(v as IEventFormInput)
        }}
        initialValues={formValues}
        mutators={{
          ...arrayMutators,
        }}
        validateOnBlur
        render={({ submitting, values, invalid, errors, handleSubmit }) => {
          const disabled = invalid || submitting
          return (
            <Flex mx={-2} bg={'inherit'} flexWrap="wrap">
              <Flex bg="inherit" px={2} width={[1, 1, 2 / 3]} mt={4}>
                <FormContainer onSubmit={e => e.preventDefault()}>
                  {/* How To Info */}
                  <Flex flexDirection={'column'}>
                    <Flex card mediumRadius bg={'softblue'} px={3} py={2}>
                      <Heading medium>Create an event</Heading>
                    </Flex>
                    <Flex
                      card
                      mediumRadius
                      bg={'white'}
                      mt={5}
                      p={4}
                      flexWrap="wrap"
                      flexDirection="column"
                    >
                      <Flex
                        flexDirection={'column'}
                        mb={3}
                        width={[1, 1, 2 / 3]}
                      >
                        <Label htmlFor="title">Title of the event *</Label>
                        <Field
                          id="title"
                          name="title"
                          data-cy="title"
                          validate={value => this.validateTitle(value)}
                          validateFields={[]}
                          component={InputField}
                          placeholder="Title of your event"
                        />
                      </Flex>
                      <Flex
                        mx={-2}
                        width={1}
                        flexDirection={['column', 'column', 'row']}
                      >
                        <Flex flexDirection={'column'} mb={3} px={2} width={1} data-cy="date">
                          <Label htmlFor="location">
                            When is your event taking place? *
                          </Label>
                          <DatePicker
                            className="datepicker"
                            name="date"
                            type="date"
                            dateFormat="yyyy/MM/dd"
                            validate={required}
                            selected={this.state.selectedDate}
                            onChange={this.handleChange}
                            placeholderText="yyyy/mm/dd"
                          />
                        </Flex>
                        <Flex flexDirection={'column'} mb={3} px={2} width={1}>
                          <Label htmlFor="location">
                            In which city is the event taking place? *
                          </Label>
                          <Field
                            id="location"
                            name="location"
                            className="location-search-create"
                            validateFields={[]}
                            validate={(value: any) =>
                              value.hasOwnProperty('latlng')
                                ? undefined
                                : 'Required'
                            }
                            component={LocationSearchField}
                          />
                        </Flex>
                      </Flex>
                      <Flex
                        mx={-2}
                        width={1}
                        flexDirection={['column', 'column', 'row']}
                      >
                        <Flex flexDirection={'column'} mb={3} px={2} width={1}>
                          <Label htmlFor="location">
                            Select tags for your event *
                          </Label>
                          <Field
                            name="tags"
                            component={TagsSelectField}
                            category="event"
                          />
                        </Flex>
                        <Flex flexDirection={'column'} mb={3} px={2} width={1}>
                          <Label htmlFor="location">Link to your event *</Label>
                          <Field
                            name="url"
                            data-cy="url"
                            validateFields={[]}
                            validate={value => this.validateUrl(value)}
                            component={InputField}
                            placeholder="URL to offsite link (Facebook, Meetup, etc)"
                          />
                        </Flex>
                      </Flex>
                    </Flex>
                  </Flex>
                </FormContainer>
              </Flex>

              {/* post guidelines container */}
              <Flex
                flexDirection={'column'}
                width={[1, 1, 1 / 3]}
                height={'100%'}
                bg="inherit"
                px={2}
                mt={4}
              >
                <PostingGuidelines />
                <Button
                  onClick={() => handleSubmit()}
                  width={1}
                  mt={3}
                  variant={disabled ? 'primary' : 'primary'}
                  disabled={submitting || invalid}
                  data-cy="submit"
                >
                  Publish
                </Button>
              </Flex>
            </Flex>
          )
        }}
      />
    )
  }
}
