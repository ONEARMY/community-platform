import { PureComponent } from 'react'
import { Field } from 'react-final-form'
import { TextAreaField, InputField } from 'src/components/Form/Fields'
import Heading from 'src/components/Heading'
import { ImageInputField } from 'src/components/Form/ImageInput.field'
import Flex from 'src/components/Flex'
import { Button } from 'oa-components'
import { Modal } from 'src/components/Modal/Modal'
import Text from 'src/components/Text'
import styled from '@emotion/styled'
import theme from 'src/themes/styled.theme'
import { IHowtoStep } from 'src/models/howto.models'
import { IUploadedFileMeta } from 'src/stores/storage'
import { required } from 'src/utils/validators'
import { COMPARISONS } from 'src/utils/comparisons'
import { HOWTO_MAX_LENGTH, HOWTO_TITLE_MAX_LENGTH } from '../../constants'

const ImageInputFieldWrapper = styled.div`
  width: 150px;
  height: 100px;
  margin-right: 10px;
`

interface IProps {
  step: any | IHowtoStep
  index: number
  images: IUploadedFileMeta[]
  onDelete: (index: number) => void
  moveStep: (indexfrom: number, indexTo: number) => void
}
interface IState {
  showDeleteModal: boolean
  _toDocsList: boolean
}

const Label = styled.label`
  font-size: ${theme.fontSizes[2] + 'px'};
  margin-bottom: ${theme.space[2] + 'px'};
`

class HowtoStep extends PureComponent<IProps, IState> {
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
  /**
   * Ensure either url or images included (not both), and any url formatted correctly
   */
  validateMedia(videoUrl: string) {
    const { images } = { ...this.props }
    if (videoUrl) {
      if (images[0]) {
        return 'Do not include both images and video'
      }
      const ytRegex = new RegExp(/(youtu\.be\/|youtube\.com\/watch\?v=)/gi)
      const urlValid = ytRegex.test(videoUrl)
      return urlValid ? null : 'Please provide a valid YouTube Url'
    }
    return images[0] ? null : 'Include either images or a video'
  }

  render() {
    const { step, index } = this.props

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
              data-cy="move-step"
              variant={'secondary'}
              icon="arrow-full-up"
              sx={{ mx: '5px' }}
              onClick={() => this.props.moveStep(index, index - 1)}
            />
          )}
          <Button
            data-cy="move-step"
            variant={'secondary'}
            icon="arrow-full-down"
            sx={{ mx: '5px' }}
            onClick={() => this.props.moveStep(index, index + 1)}
          />
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
            modifiers={{ capitalize: true }}
            component={InputField}
            placeholder={`Title of this step (max ${HOWTO_TITLE_MAX_LENGTH} characters)`}
            maxLength={HOWTO_TITLE_MAX_LENGTH}
            validate={required}
            validateFields={[]}
            isEqual={COMPARISONS.textInput}
          />
        </Flex>
        <Flex flexDirection="column" mb={3}>
          <Label htmlFor={`${step}.text`}>Description of this step *</Label>
          <Field
            name={`${step}.text`}
            placeholder="Explain what you are doing in this step. if it gets to long break it into 2 steps (max 700 characters)"
            maxLength={HOWTO_MAX_LENGTH}
            data-cy="step-description"
            modifiers={{ capitalize: true }}
            component={TextAreaField}
            style={{ resize: 'vertical', height: '300px' }}
            validate={required}
            validateFields={[]}
            isEqual={COMPARISONS.textInput}
          />
        </Flex>
        <Label htmlFor={`${step}.text`}>Upload image(s) for this step *</Label>
        <Flex flexDirection={['column', 'row']} alignItems="center" mb={3}>
          <ImageInputFieldWrapper data-cy="step-image-0">
            <Field
              hasText={false}
              name={`${step}.images[0]`}
              component={ImageInputField}
              isEqual={COMPARISONS.image}
            />
          </ImageInputFieldWrapper>
          <ImageInputFieldWrapper data-cy="step-image-1">
            <Field
              hasText={false}
              name={`${step}.images[1]`}
              component={ImageInputField}
              isEqual={COMPARISONS.image}
            />
          </ImageInputFieldWrapper>
          <ImageInputFieldWrapper data-cy="step-image-2">
            <Field
              hasText={false}
              name={`${step}.images[2]`}
              component={ImageInputField}
              isEqual={COMPARISONS.image}
            />
          </ImageInputFieldWrapper>
        </Flex>
        <Flex flexDirection="column" mb={3}>
          <Label htmlFor={`${step}.videoUrl`}>Or embed a YouTube video*</Label>
          <Field
            name={`${step}.videoUrl`}
            data-cy="step-videoUrl"
            component={InputField}
            placeholder="https://youtube.com/watch?v="
            validate={url => this.validateMedia(url)}
            validateFields={[]}
            isEqual={COMPARISONS.textInput}
          />
        </Flex>
      </Flex>
    )
  }
}

export { HowtoStep }
