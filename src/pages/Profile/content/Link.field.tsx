import React, { Component } from 'react'
import Selector from 'src/components/Selector'
import COM_TYPE_MOCK from 'src/mocks/communicationSelector.mock'
import { Field } from 'react-final-form'
import { InputField } from 'src/components/Form/Fields'
import { Button } from 'src/components/Button'
import { Modal } from 'src/components/Modal/Modal'
import Text from 'src/components/Text'
import { Flex } from 'rebass'
import { FlexContainer } from 'src/components/Layout/FlexContainer'

interface IProps {
  link: string
  index: number
  onDelete: (index: number) => void
}
interface IState {
  showDeleteModal: boolean
  _toDocsList: boolean
}

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
        <Selector list={COM_TYPE_MOCK} width={[1 / 5]} my={2} mr={2} />
        <Field name={`${link}.url`} component={InputField} placeholder="Link" />
        <Button icon={'delete'} onClick={() => this.toggleDeleteModal()} />
        {this.state.showDeleteModal && (
          <Modal onDidDismiss={() => this.toggleDeleteModal()}>
            <Text>Are you sure you want to delete this link?</Text>
            <FlexContainer p={0} justifyContent="flex-end">
              <Button onClick={() => this.toggleDeleteModal()}>Cancel</Button>
              <Button onClick={() => this.confirmDelete()}>Delete</Button>
            </FlexContainer>
          </Modal>
        )}
      </Flex>
    )
  }
}

export { Link }
