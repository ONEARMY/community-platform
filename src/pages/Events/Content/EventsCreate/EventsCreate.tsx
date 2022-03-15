import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Form, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import TEMPLATE from './Template'
import { UploadedFile } from 'src/pages/common/UploadedFile/UploadedFile'
import { InputField, DatePickerField } from 'src/components/Form/Fields'
import { Button } from 'oa-components'
import { EventStore } from 'src/stores/Events/events.store'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import Flex from 'src/components/Flex'
import { TagsSelectField } from 'src/components/Form/TagsSelect.field'
import { inject } from 'mobx-react'
import { PostingGuidelines } from './PostingGuidelines'
import { IEventFormInput } from 'src/models/events.models'
import { LocationSearchField } from 'src/components/Form/LocationSearch.field'
import styled from '@emotion/styled'
import theme from 'src/themes/styled.theme'
import { validateUrl, addProtocolMutator, required } from 'src/utils/validators'
import { Box } from 'rebass'
import ElWithBeforeIcon from 'src/components/ElWithBeforeIcon'
import IconHeaderEvents from 'src/assets/images/header-section/events-header-icon.svg'
import { logger } from 'src/logger'

interface IState {
  formValues: IEventFormInput
  formSaved: boolean
  showSubmitModal?: boolean
  selectedDate: any
  isLocationSelected?: boolean
}
type IProps = RouteComponentProps<any>
interface IInjectedProps extends IProps {
  eventStore: EventStore
}

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
    logger.debug('form values', formValues)
    await this.store.uploadEvent(formValues)
    this.props.history.push('/events')
  }

  public handleChange = (date: any) => {
    this.setState({
      selectedDate: date,
    })
  }

  public render() {
    const { formValues, isLocationSelected } = this.state
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
          addProtocolMutator,
        }}
        validateOnBlur
        render={({ form: { mutators }, submitting, handleSubmit }) => {
          return (
            <Flex mx={-2} bg={'inherit'} flexWrap="wrap">
              <Flex bg="inherit" px={2} width={[1, 1, 2 / 3]} mt={4}>
                <FormContainer onSubmit={e => e.preventDefault()}>
                  {/* How To Info */}
                  <Flex flexDirection={'column'}>
                    <Flex
                      card
                      mediumRadius
                      bg={theme.colors.softblue}
                      px={3}
                      py={2}
                      alignItems="center"
                    >
                      <Heading medium>Create an event</Heading>
                      <Box ml="15px">
                        <ElWithBeforeIcon
                          IconUrl={IconHeaderEvents}
                          height="20px"
                        />
                      </Box>
                    </Flex>
                    <Box
                      sx={{ mt: '20px', display: ['block', 'block', 'none'] }}
                    >
                      <PostingGuidelines />
                    </Box>
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
                          validate={required}
                          validateFields={[]}
                          modifiers={{ capitalize: true }}
                          component={InputField}
                          maxLength="140"
                          placeholder="Title of your event (max 140 characters)"
                        />
                      </Flex>
                      <Flex
                        mx={-2}
                        width={1}
                        flexDirection={['column', 'column', 'row']}
                      >
                        <Flex
                          flexDirection={'column'}
                          mb={3}
                          px={2}
                          width={1}
                          data-cy="date"
                        >
                          <Label htmlFor="location">
                            When is your event taking place? *
                          </Label>
                          <Field
                            className="datepicker"
                            component={DatePickerField}
                            name="date"
                            type="date"
                            dateFormat="yyyy/MM/dd"
                            validate={required}
                            selected={this.state.selectedDate}
                            customChange={date => this.handleChange(date)}
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
                            validate={required}
                            customChange={() => {
                              this.setState({
                                isLocationSelected: true,
                              })
                            }}
                            component={LocationSearchField}
                          />
                          {isLocationSelected !== undefined &&
                            !isLocationSelected && (
                              <Text small color={theme.colors.red} mb="5px">
                                Select a location for your event
                              </Text>
                            )}
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
                            validate={value => validateUrl(value)}
                            component={InputField}
                            placeholder="URL to offsite link (Facebook, Meetup, etc)"
                            customOnBlur={e =>
                              mutators.addProtocolMutator(e.target.name)
                            }
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
                <Box sx={{ display: ['none', 'none', 'block'] }}>
                  <PostingGuidelines />
                </Box>
                <Button
                  onClick={() => {
                    if (isLocationSelected) {
                      handleSubmit()
                    } else {
                      this.setState({ isLocationSelected: false })
                    }
                  }}
                  width={1}
                  mt={3}
                  variant={'primary'}
                  disabled={submitting}
                  data-cy="submit"
                  sx={{ mb: ['40px', '40px', 0] }}
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
