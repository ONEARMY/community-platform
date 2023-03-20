import { Component } from 'react'
import { Field } from 'react-final-form'
import { Button, Modal } from 'oa-components'
import { Text, Flex } from 'theme-ui'
import { SelectField } from 'src/common/Form/Select.field'
import { required } from 'src/utils/validators'

const WEEK_DAYS = [
  {
    value: 'Monday',
    label: 'Monday',
  },
  {
    value: 'Tuesday',
    label: 'Tuesday',
  },
  {
    value: 'Wednesday',
    label: 'Wednesday',
  },
  {
    value: 'Thursday',
    label: 'Thursday',
  },
  {
    value: 'Friday',
    label: 'Friday',
  },
  {
    value: 'Saturday',
    label: 'Saturday',
  },
  {
    value: 'Sunday',
    label: 'Sunday',
  },
]

const OPENING_HOURS = [
  {
    value: '01:00 AM',
    label: '01:00 AM',
  },
  {
    value: '02:00 AM',
    label: '02:00 AM',
  },
  {
    value: '03:00 AM',
    label: '03:00 AM',
  },
  {
    value: '04:00 AM',
    label: '04:00 AM',
  },
  {
    value: '05:00 AM',
    label: '05:00 AM',
  },
  {
    value: '06:00 AM',
    label: '06:00 AM',
  },
  {
    value: '07:00 AM',
    label: '07:00 AM',
  },
  {
    value: '08:00 AM',
    label: '08:00 AM',
  },
  {
    value: '09:00 AM',
    label: '09:00 AM',
  },
  {
    value: '10:00 AM',
    label: '10:00 AM',
  },
  {
    value: '11:00 AM',
    label: '11:00 AM',
  },
  {
    value: '12:00 AM',
    label: '12:00 AM',
  },
  {
    value: '01:00 PM',
    label: '01:00 PM',
  },
  {
    value: '02:00 PM',
    label: '02:00 PM',
  },
  {
    value: '03:00 PM',
    label: '03:00 PM',
  },
  {
    value: '04:00 PM',
    label: '04:00 PM',
  },
  {
    value: '05:00 PM',
    label: '05:00 PM',
  },
  {
    value: '06:00 PM',
    label: '06:00 PM',
  },
  {
    value: '07:00 PM',
    label: '07:00 PM',
  },
  {
    value: '08:00 PM',
    label: '08:00 PM',
  },
  {
    value: '09:00 PM',
    label: '09:00 PM',
  },
  {
    value: '10:00 PM',
    label: '10:00 PM',
  },
  {
    value: '11:00 PM',
    label: '11:00 PM',
  },
  {
    value: '12:00 PM',
    label: '12:00 PM',
  },
]

interface IProps {
  openingHoursValues?: string
  index: number
  onDelete: (index: number) => void
}
interface IState {
  showDeleteModal: boolean
  _toDocsList: boolean
}

export class OpeningHoursPicker extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      showDeleteModal: false,
      _toDocsList: false,
    }
  }

  toggleDeleteModal() {
    this.setState({ showDeleteModal: !this.state.showDeleteModal })
  }
  confirmDelete() {
    this.toggleDeleteModal()
    this.props.onDelete(this.props.index)
  }

  render() {
    const { openingHoursValues, index } = this.props
    return (
      <Flex
        key={index}
        sx={{
          gap: '8px',
          alignItems: 'flex-start',
          flexWrap: ['wrap', 'wrap', 'nowrap'],
        }}
        my={1}
      >
        <Flex mb={1} sx={{ gap: '8px' }}>
          <Field
            data-cy={`opening-time-day-${index}`}
            name={`${openingHoursValues}.day`}
            options={WEEK_DAYS}
            component={SelectField}
            validate={required}
            validateFields={[]}
            placeholder="Select day"
            style={{ marginBottom: 0 }}
          />
          <Button
            icon={'delete'}
            variant={'outline'}
            sx={{ height: '40px', display: ['block', 'block', 'none'] }}
            onClick={() => this.toggleDeleteModal()}
          />
        </Flex>
        <Flex sx={{ gap: '8px' }}>
          <Field
            data-cy={`opening-time-from-${index}`}
            name={`${openingHoursValues}.openFrom`}
            options={OPENING_HOURS}
            component={SelectField}
            placeholder="from --:-- AM"
            validate={required}
            validateFields={[]}
            showError={false}
            style={{ marginBottom: 0 }}
          />
          <Field
            data-cy={`opening-time-to-${index}`}
            name={`${openingHoursValues}.openTo`}
            options={OPENING_HOURS}
            component={SelectField}
            placeholder="to --:-- PM"
            validate={required}
            validateFields={[]}
            showError={false}
            style={{ marginBottom: 0 }}
          />
        </Flex>
        <Button
          icon={'delete'}
          variant={'outline'}
          data-cy={`delete-opening-time-${index}-desk`}
          sx={{ height: '40px', display: ['none', 'none', 'block'] }}
          showIconOnly={true}
          onClick={() => this.toggleDeleteModal()}
        >
          Delete
        </Button>
        <Modal
          onDidDismiss={() => this.toggleDeleteModal()}
          isOpen={this.state.showDeleteModal}
        >
          <Text>Are you sure you want to delete this schedule ?</Text>
          <Flex p={0} mx={-1} sx={{ justifyContent: 'flex-end' }}>
            <Flex px={1}>
              <Button
                data-cy={'cancel-delete'}
                variant={'outline'}
                onClick={() => this.toggleDeleteModal()}
              >
                Cancel
              </Button>
            </Flex>
            <Flex px={1}>
              <Button
                data-cy={'confirm-delete'}
                variant={'outline'}
                onClick={() => this.confirmDelete()}
              >
                Delete
              </Button>
            </Flex>
          </Flex>
        </Modal>
      </Flex>
    )
  }
}
