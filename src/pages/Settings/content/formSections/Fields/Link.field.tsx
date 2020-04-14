import React, { Component } from 'react'
import { COM_TYPE_MOCKS } from 'src/mocks/Selectors'
import { Field } from 'react-final-form'
import { InputField } from 'src/components/Form/Fields'
import { Button } from 'src/components/Button'
import { Modal } from 'src/components/Modal/Modal'
import Text from 'src/components/Text'
import Flex from 'src/components/Flex'
import { SelectField } from 'src/components/Form/Select.field'
import { validateUrl, validateEmail, required } from 'src/utils/validators'

interface IProps {
  link: string
  index: number
  mutators?: { [key: string]: (...args: any[]) => any }
  initialType?: string
  onDelete: (index: number) => void
}
interface IState {
  showDeleteModal: boolean
  _toDocsList: boolean
  linkType?: string
}

class Link extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      showDeleteModal: false,
      _toDocsList: false,
      linkType: this.props.initialType ? this.props.initialType : '',
    }
  }

  toggleDeleteModal() {
    this.setState({ showDeleteModal: !this.state.showDeleteModal })
  }
  confirmDelete() {
    this.toggleDeleteModal()
    this.props.onDelete(this.props.index)
  }

  public mutatorsDependingOnType(e) {
    switch (this.state.linkType) {
      case 'social-media':
        return (
          this.props.mutators && this.props.mutators.addProtocol(e.target.name)
        )
      case 'bazar':
        return (
          this.props.mutators && this.props.mutators.addProtocol(e.target.name)
        )
      case 'website':
        return (
          this.props.mutators && this.props.mutators.addProtocol(e.target.name)
        )
      case 'forum':
        return (
          this.props.mutators && this.props.mutators.addProtocol(e.target.name)
        )
      default:
        break
    }
  }
  public validateDependingOnType(e) {
    switch (this.state.linkType) {
      case 'email':
        return validateEmail(e)
      case 'forum':
        return validateUrl(e)
      case 'website':
        return validateUrl(e)
      case 'social-media':
        return validateUrl(e)
      case 'bazar':
        return validateUrl(e)
      default:
        return required(e)
    }
  }

  render() {
    const { link, index } = this.props
    const DeleteButton = props => (
      <Button
        data-cy={`delete-link-${index}`}
        icon={'delete'}
        variant={'tertiary'}
        onClick={() => this.toggleDeleteModal()}
        ml={'10px'}
        {...props}
      />
    )
    return (
      <Flex
        key={index}
        my={['10px', '10px', '5px']}
        flexDirection={['column', 'column', 'row']}
      >
        <Flex mb={[1, 1, 0]}>
          <Field
            data-cy={`select-link-${index}`}
            name={`${link}.label`}
            options={COM_TYPE_MOCKS}
            component={SelectField}
            onCustomChange={v => {
              this.setState({ linkType: v })
            }}
            placeholder="Type"
            style={{ width: '160px', height: '40px', marginRight: '8px' }}
          />
          {!!index && (
            <DeleteButton
              sx={{ display: ['block', 'block', 'none'], height: '40px' }}
            />
          )}
        </Flex>
        <Field
          data-cy={`input-link-${index}`}
          name={`${link}.url`}
          validate={value => this.validateDependingOnType(value)}
          validateFields={[]}
          component={InputField}
          placeholder="Link"
          customOnBlur={e => {
            this.mutatorsDependingOnType(e)
          }}
        />
        <DeleteButton
          sx={{ display: ['none', 'none', 'block'], height: '40px' }}
        />
        {this.state.showDeleteModal && (
          <Modal onDidDismiss={() => this.toggleDeleteModal()}>
            <Text>Are you sure you want to delete this link?</Text>
            <Flex p={0} mx={-1} justifyContent="flex-end">
              <Flex px={1}>
                <Button
                  variant={'outline'}
                  onClick={() => this.toggleDeleteModal()}
                >
                  Cancel
                </Button>
              </Flex>
              <Flex px={1}>
                <Button
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
