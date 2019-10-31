import React, { Component } from 'react'
import { Field } from 'react-final-form'
import { TextAreaField, InputField } from 'src/components/Form/Fields'
import { Box, Image } from 'rebass'
import Heading from 'src/components/Heading'
import { ImageInputField } from 'src/components/Form/ImageInput.field'
import Flex from 'src/components/Flex'
import { Button } from 'src/components/Button'
import { Modal } from 'src/components/Modal/Modal'
import Text from 'src/components/Text'
import styled from 'styled-components'
import theme from 'src/themes/styled.theme'
import { IHowtoStep } from 'src/models/howto.models'
import { IUploadedFileMeta } from 'src/stores/storage'

interface IProps {
  step: any | IHowtoStep
  index: number
  images: IUploadedFileMeta[]
  onDelete: (index: number) => void
}
interface IState {
  showDeleteModal: boolean
  _toDocsList: boolean
  editStepImgs: boolean
}

const required = (value: any) => (value ? undefined : 'Required')

const Label = styled.label`
  font-size: ${theme.fontSizes[2] + 'px'};
  margin-bottom: ${theme.space[2] + 'px'};
`

class HowtoStep extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      showDeleteModal: false,
      _toDocsList: false,
      editStepImgs: false,
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
    const { step, index, images } = this.props
    const { editStepImgs } = this.state

    return (
      // NOTE - animation parent container in CreateHowTo
      <Flex
        data-cy={`step_${index}`}
        mt={5}
        p={3}
        key={index}
        card
        mediumRadius
        bg={'white'}
        flexDirection={'column'}
      >
        <Flex p={0}>
          <Heading small flex={1} mb={3}>
            Step {index + 1}
          </Heading>
          {index >= 1 && (
            <Button
              data-cy="delete-step"
              variant={'tertiary'}
              icon="delete"
              onClick={() => this.toggleDeleteModal()}
            />
          )}
          {this.state.showDeleteModal && (
            <Modal onDidDismiss={() => this.toggleDeleteModal()}>
              <Text>Are you sure you want to delete this step?</Text>
              <Flex mt={3} p={0} mx={-1} justifyContent="flex-end">
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
                    data-cy="confirm"
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

        <Flex flexDirection="column" mb={3}>
          <Label htmlFor={`${step}.title`}>Title of this step *</Label>
          <Field
            name={`${step}.title`}
            data-cy="step-title"
            component={InputField}
            placeholder="Title of this step"
            validate={required}
            validateFields={[]}
          />
        </Flex>
        <Flex flexDirection="column" mb={3}>
          <Label htmlFor={`${step}.text`}>Description of this step *</Label>
          <Field
            name={`${step}.text`}
            placeholder="Description of this step"
            data-cy="step-description"
            component={TextAreaField}
            style={{ resize: 'vertical', height: '300px' }}
            validate={required}
            validateFields={[]}
          />
        </Flex>
        <Flex flexDirection="column">
          <Label htmlFor={`${step}.text`}>
            Upload image(s) for this step *
          </Label>
          {images.length > 0 &&
          images[0].downloadUrl !== undefined &&
          !editStepImgs ? (
            <Flex alignItems={'center'} justifyContent={'center'}>
              {images.map(image => {
                return (
                  <Flex
                    flexWrap={'nowrap'}
                    px={1}
                    width={1 / 4}
                    key={image.name}
                  >
                    <Image sx={{ opacity: 0.5 }} src={image.downloadUrl} />
                  </Flex>
                )
              })}
              <Button
                data-cy="delete-step-img"
                icon={'delete'}
                variant={'tertiary'}
                sx={{ position: 'absolute' }}
                onClick={() =>
                  this.setState({
                    editStepImgs: !editStepImgs,
                  })
                }
              />
            </Flex>
          ) : (
            <Field name={`${step}.images`} component={ImageInputField} multi />
          )}
        </Flex>
        <Flex mt={2}>
          <Field
            name={`${step}.caption`}
            data-cy="step-caption"
            component={InputField}
            placeholder="Insert Caption"
          />
        </Flex>
      </Flex>
    )
  }
}

export { HowtoStep }
