import { PureComponent } from 'react'
import { Field } from 'react-final-form'
import { Heading, Card, Flex, Text, Label } from 'theme-ui'
import { ImageInputField } from 'src/common/Form/ImageInput.field'
import { Button, FieldInput, FieldTextarea, Modal } from 'oa-components'
import styled from '@emotion/styled'
import type { IHowtoStep } from 'src/models/howto.models'
import type { IUploadedFileMeta } from 'src/stores/storage'
import {
  draftValidationWrapper,
  required,
  minValue,
  composeValidators,
} from 'src/utils/validators'
import { COMPARISONS } from 'src/utils/comparisons'
import {
  HOWTO_STEP_DESCRIPTION_MIN_LENGTH,
  HOWTO_STEP_DESCRIPTION_MAX_LENGTH,
  HOWTO_MIN_REQUIRED_STEPS,
  HOWTO_TITLE_MAX_LENGTH,
  HOWTO_TITLE_MIN_LENGTH,
} from '../../constants'

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
// font-size: ${theme.fontSizes[2] + 'px'};

// const Label = styled.label`
//   font-size: ${theme.fontSizes[2] + 'px'};
//   margin-bottom: ${theme.space[2] + 'px'};
// `

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

  /**
   * Ensure that the How to description meets the following criteria:
   * - required
   * - minimum character length of 100 characters
   * - maximum character length of 1000 characters
   *
   * @param value - How to step description field value
   */
  render() {
    const { step, index } = this.props
    const _labelStyle = {
      fontSize: 2,
      marginBottom: 2,
    }

    const isAboveMinimumStep = index >= HOWTO_MIN_REQUIRED_STEPS

    return (
      // NOTE - animation parent container in CreateHowTo
      <Card data-cy={`step_${index}`} mt={5} key={index}>
        <Flex p={3} sx={{ flexDirection: 'column' }}>
          <Flex p={0}>
            <Heading variant="small" sx={{ flex: 1 }} mb={3}>
              Step {index + 1} {!isAboveMinimumStep && '*'}
            </Heading>
            {index >= 1 && (
              <Button
                data-cy="move-step"
                variant={'secondary'}
                icon="arrow-full-up"
                showIconOnly={true}
                sx={{ mx: '5px' }}
                onClick={() => this.props.moveStep(index, index - 1)}
              />
            )}
            <Button
              data-cy="move-step"
              variant={'secondary'}
              icon="arrow-full-down"
              sx={{ mx: '5px' }}
              showIconOnly={true}
              onClick={() => this.props.moveStep(index, index + 1)}
            />
            {isAboveMinimumStep && (
              <Button
                data-cy="delete-step"
                variant={'outline'}
                showIconOnly={true}
                icon="delete"
                onClick={() => this.toggleDeleteModal()}
              />
            )}

            <Modal
              onDidDismiss={() => this.toggleDeleteModal()}
              isOpen={!!this.state.showDeleteModal}
            >
              <Text>Are you sure you want to delete this step?</Text>
              <Flex mt={3} p={0} mx={-1} sx={{ justifyContent: 'flex-end' }}>
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
                    variant={'outline'}
                    onClick={() => this.confirmDelete()}
                  >
                    Delete
                  </Button>
                </Flex>
              </Flex>
            </Modal>
          </Flex>

          <Flex sx={{ flexDirection: 'column' }} mb={3}>
            <Label sx={_labelStyle} htmlFor={`${step}.title`}>
              Title of this step *
            </Label>
            <Field
              name={`${step}.title`}
              data-cy="step-title"
              modifiers={{ capitalize: true }}
              component={FieldInput}
              placeholder={`Title of this step (max ${HOWTO_TITLE_MAX_LENGTH} characters)`}
              maxLength={HOWTO_TITLE_MAX_LENGTH}
              minLength={HOWTO_TITLE_MIN_LENGTH}
              validate={(value, allValues) =>
                draftValidationWrapper(
                  value,
                  allValues,
                  composeValidators(required, minValue(HOWTO_TITLE_MIN_LENGTH)),
                )
              }
              validateFields={[]}
              isEqual={COMPARISONS.textInput}
              showCharacterCount
            />
          </Flex>
          <Flex sx={{ flexDirection: 'column' }} mb={3}>
            <Label sx={_labelStyle} htmlFor={`${step}.text`}>
              Description of this step *
            </Label>
            <Field
              name={`${step}.text`}
              placeholder={`Explain what you are doing in this step. If it gets too long, consider breaking it into multiple steps (${HOWTO_STEP_DESCRIPTION_MIN_LENGTH}-${HOWTO_STEP_DESCRIPTION_MAX_LENGTH} characters)`}
              minLength={HOWTO_STEP_DESCRIPTION_MIN_LENGTH}
              maxLength={HOWTO_STEP_DESCRIPTION_MAX_LENGTH}
              data-cy="step-description"
              data-testid="step-description"
              modifiers={{ capitalize: true }}
              component={FieldTextarea}
              style={{ resize: 'vertical', height: '300px' }}
              validate={(value, allValues) =>
                draftValidationWrapper(
                  value,
                  allValues,
                  composeValidators(
                    required,
                    minValue(HOWTO_STEP_DESCRIPTION_MIN_LENGTH),
                  ),
                )
              }
              validateFields={[]}
              isEqual={COMPARISONS.textInput}
              showCharacterCount
            />
          </Flex>
          <Label sx={_labelStyle} htmlFor={`${step}.text`}>
            Upload image(s) for this step *
          </Label>
          <Flex
            sx={{ flexDirection: ['column', 'row'], alignItems: 'center' }}
            mb={3}
          >
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
          <Flex sx={{ flexDirection: 'column' }} mb={3}>
            <Label sx={_labelStyle} htmlFor={`${step}.videoUrl`}>
              Or embed a YouTube video*
            </Label>
            <Field
              name={`${step}.videoUrl`}
              data-cy="step-videoUrl"
              component={FieldInput}
              placeholder="https://youtube.com/watch?v="
              validate={(value, allValues) =>
                draftValidationWrapper(
                  value,
                  allValues,
                  this.validateMedia.bind(this),
                )
              }
              validateFields={[]}
              isEqual={COMPARISONS.textInput}
            />
          </Flex>
        </Flex>
      </Card>
    )
  }
}

export { HowtoStep }
