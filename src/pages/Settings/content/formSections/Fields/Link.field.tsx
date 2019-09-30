import React, { Component } from 'react'
import { COM_TYPE_MOCKS } from 'src/mocks/Selectors'
import { Field } from 'react-final-form'
import { InputField } from 'src/components/Form/Fields'
import { Button } from 'src/components/Button'
import { Modal } from 'src/components/Modal/Modal'
import Text from 'src/components/Text'
import Flex from 'src/components/Flex'
import { SelectField } from 'src/components/Form/Select.field'

interface IProps {
  link: string
  index: number
  onDelete: (index: number) => void
}
interface IState {
  showDeleteModal: boolean
  _toDocsList: boolean
}

// validation - return undefined if no error (i.e. valid)
const required = (value: any) => (value ? undefined : 'Required')

class Link extends Component<IProps, IState> {
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
    const { link, index } = this.props
    return (
      <Flex key={index}>
        <Field
          name={`${link}.label`}
          options={COM_TYPE_MOCKS}
          component={SelectField}
          placeholder="type"
          style={{ width: '160px', marginRight: '8px' }}
        />
        <Field name={`${link}.url`} component={InputField} placeholder="Link" />
        <Button
          icon={'delete'}
          variant={'tertiary'}
          onClick={() => this.toggleDeleteModal()}
          ml={'10px'}
        />
        {this.state.showDeleteModal && (
          <Modal onDidDismiss={() => this.toggleDeleteModal()}>
            <Text>Are you sure you want to delete this link?</Text>
            <Flex p={0} mx={-1} justifyContent="flex-end">
              <Flex px={1}>
                <Button
                  small
                  variant={'outline'}
                  onClick={() => this.toggleDeleteModal()}
                >
                  Cancel
                </Button>
              </Flex>
              <Flex px={1}>
                <Button
                  small
                  variant={'tertiary'}
                  onClick={() => this.confirmDelete()}
                >
                  Delete
                </Button>
              </Flex>
            </Flex>
          </Modal>
        )}
      </Flex>
    )
  }
}

export { Link }
