import React, { Component } from 'react'
import { Field } from 'react-final-form'
import { TextAreaField, InputField } from 'src/components/Form/Fields'
import { BoxContainer } from 'src/components/Layout/BoxContainer'
import Heading from 'src/components/Heading'
import { ImageInputField } from 'src/components/Form/ImageInput.field'
import { FlexContainer } from 'src/components/Layout/FlexContainer'
import { Button } from 'src/components/Button'
import { Modal } from 'src/components/Modal/Modal'
import Text from 'src/components/Text'

interface IProps {
  step: string
  index: number
  onDelete: (index: number) => void
}
interface IState {
  showDeleteModal: boolean
  _toDocsList: boolean
}

const required = (value: any) => (value ? undefined : 'Required')

class Step extends Component<IProps, IState> {
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
    const { step, index } = this.props
    return (
      // NOTE - animation parent container in CreateHowTo
      <BoxContainer mt={3} p={3} key={index}>
        <FlexContainer p={0}>
          <Heading medium flex={1}>
            Step {index + 1}
          </Heading>
          {index >= 1 && (
            <Button icon="delete" onClick={() => this.toggleDeleteModal()} />
          )}
          {this.state.showDeleteModal && (
            <Modal onDidDismiss={() => this.toggleDeleteModal()}>
              <Text>Are you sure you want to delete this step?</Text>
              <FlexContainer p={0} justifyContent="flex-end">
                <Button onClick={() => this.toggleDeleteModal()}>Cancel</Button>
                <Button onClick={() => this.confirmDelete()}>Delete</Button>
              </FlexContainer>
            </Modal>
          )}
        </FlexContainer>

        <FlexContainer p={0} flexWrap="wrap">
          <Field
            name={`${step}.title`}
            component={InputField}
            placeholder={`Title of Step ${index + 1}`}
            validate={required}
            validateFields={[]}
          />
          {/* Left */}
          <FlexContainer p={0} pr={2} flexDirection="column" flex={1}>
            <Field
              name={`${step}.text`}
              placeholder="Describe this step"
              component={TextAreaField}
              style={{ resize: 'vertical', height: '100%' }}
              validate={required}
              validateFields={[]}
            />
          </FlexContainer>
          {/* right */}
          <BoxContainer p={0} width={[1, '305px', null]}>
            <Field name={`${step}.images`} component={ImageInputField} multi />
            <Field
              name={`${step}.caption`}
              component={InputField}
              placeholder="Insert Caption"
            />
          </BoxContainer>
        </FlexContainer>
      </BoxContainer>
    )
  }
}

export { Step }
