import React, { useState } from 'react'
import { Field } from 'react-final-form'
import styled from '@emotion/styled'
import { Button, FieldInput, FieldTextarea, Modal } from 'oa-components'
import { ImageInputField } from 'src/common/Form/ImageInput.field'
import { COMPARISONS } from 'src/utils/comparisons'
import {
  composeValidators,
  draftValidationWrapper,
  minValue,
  required,
} from 'src/utils/validators'
import { Card, Flex, Heading, Label, Text } from 'theme-ui'

import {
  HOWTO_MIN_REQUIRED_STEPS,
  HOWTO_STEP_DESCRIPTION_MAX_LENGTH,
  HOWTO_STEP_DESCRIPTION_MIN_LENGTH,
  HOWTO_TITLE_MAX_LENGTH,
  HOWTO_TITLE_MIN_LENGTH,
} from '../../constants'
import { buttons, errors, steps } from '../../labels'

import type { IHowtoStep, IUploadedFileMeta } from 'oa-shared'

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

/**
 * Ensure that the project description meets the following criteria:
 * - required
 * - minimum character length of 100 characters
 * - maximum character length of 1000 characters
 */
export const HowtoFieldStep = (props: IProps) => {
  const { step, index } = props
  const [state, setState] = useState<IState>({
    showDeleteModal: false,
    _toDocsList: false,
  })

  const toggleDeleteModal = () => {
    setState((state) => ({ ...state, showDeleteModal: !state.showDeleteModal }))
  }
  const confirmDelete = () => {
    toggleDeleteModal()
    props.onDelete(props.index)
  }

  /**
   * Ensure either url or images included (not both), and any url formatted correctly
   */
  const validateMedia = (videoUrl: string) => {
    const { images } = { ...props }
    const { both, empty, invalidUrl } = errors.videoUrl

    if (videoUrl) {
      if (images[0]) {
        return both
      }
      const ytRegex = new RegExp(/(youtu\.be\/|youtube\.com\/watch\?v=)/gi)
      const urlValid = ytRegex.test(videoUrl)
      return urlValid ? null : invalidUrl
    }
    return images[0] ? null : empty
  }

  const { heading, images, text, title, videoUrl } = steps
  const { deleteButton } = buttons.steps
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
          <Heading as="h3" variant="small" sx={{ flex: 1 }} mb={3}>
            {heading.title} {index + 1} {!isAboveMinimumStep && '*'}
          </Heading>
          {index >= 1 && (
            <Button
              data-cy="move-step-up"
              data-testid="move-step-up"
              variant={'secondary'}
              icon="arrow-full-up"
              showIconOnly={true}
              sx={{ mx: '5px' }}
              type="button"
              onClick={() => props.moveStep(index, index - 1)}
            />
          )}
          <Button
            data-cy="move-step-down"
            data-testid="move-step-down"
            variant={'secondary'}
            icon="arrow-full-down"
            sx={{ mx: '5px' }}
            showIconOnly={true}
            type="button"
            onClick={() => props.moveStep(index, index + 1)}
          />
          {isAboveMinimumStep && (
            <Button
              data-cy="delete-step"
              data-testid="delete-step"
              variant={'outline'}
              showIconOnly={true}
              icon="delete"
              type="button"
              onClick={() => toggleDeleteModal()}
            />
          )}

          <Modal
            onDidDismiss={() => toggleDeleteModal()}
            isOpen={!!state.showDeleteModal}
          >
            <Text>{deleteButton.warning}</Text>
            <Flex mt={3} p={0} mx={-1} sx={{ justifyContent: 'flex-end' }}>
              <Flex px={1}>
                <Button variant={'outline'} onClick={() => toggleDeleteModal()}>
                  {deleteButton.cancel}
                </Button>
              </Flex>
              <Flex px={1}>
                <Button
                  data-cy="confirm"
                  data-testid="confirm"
                  variant="outline"
                  onClick={() => confirmDelete()}
                  type="button"
                >
                  {deleteButton.title}
                </Button>
              </Flex>
            </Flex>
          </Modal>
        </Flex>

        <Flex sx={{ flexDirection: 'column' }} mb={3}>
          <Label sx={_labelStyle} htmlFor={`${step}.title`}>
            {`${title.title} *`}
          </Label>
          <Field
            name={`${step}.title`}
            data-cy="step-title"
            data-testid="step-title"
            modifiers={{ capitalize: true, trim: true }}
            component={FieldInput}
            placeholder={title.placeholder}
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
            {`${text.title} *`}
          </Label>
          <Field
            name={`${step}.text`}
            placeholder={text.placeholder}
            minLength={HOWTO_STEP_DESCRIPTION_MIN_LENGTH}
            maxLength={HOWTO_STEP_DESCRIPTION_MAX_LENGTH}
            data-cy="step-description"
            data-testid="step-description"
            modifiers={{ capitalize: true, trim: true }}
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
          {`${images.title} *`}
        </Label>
        <Flex
          sx={{ flexDirection: ['column', 'row'], alignItems: 'center' }}
          mb={3}
        >
          <ImageInputFieldWrapper data-cy="step-image-0">
            <Field
              dataTestId="step-image-0"
              hasText={false}
              name={`${step}.images[0]`}
              component={ImageInputField}
              isEqual={COMPARISONS.image}
            />
          </ImageInputFieldWrapper>
          <ImageInputFieldWrapper data-cy="step-image-1">
            <Field
              dataTestId="step-image-1"
              hasText={false}
              name={`${step}.images[1]`}
              component={ImageInputField}
              isEqual={COMPARISONS.image}
            />
          </ImageInputFieldWrapper>
          <ImageInputFieldWrapper data-cy="step-image-2">
            <Field
              dataTestId="step-image-2"
              hasText={false}
              name={`${step}.images[2]`}
              component={ImageInputField}
              isEqual={COMPARISONS.image}
            />
          </ImageInputFieldWrapper>
        </Flex>
        <Flex sx={{ flexDirection: 'column' }} mb={3}>
          <Field
            name={`${step}.videoUrl`}
            data-cy="step-videoUrl"
            data-testid="step-videoUrl"
            component={FieldInput}
            placeholder={videoUrl.placeholder}
            validate={(value, allValues) =>
              draftValidationWrapper(value, allValues, validateMedia.bind(this))
            }
            validateFields={[]}
            isEqual={COMPARISONS.textInput}
          />
        </Flex>
      </Flex>
    </Card>
  )
}
