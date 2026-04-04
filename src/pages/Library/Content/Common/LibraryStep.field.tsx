import { Button, FieldInput, FieldTextarea, Modal } from 'oa-components';
import type { MediaWithPublicUrl } from 'oa-shared';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { StepImagesField } from 'src/pages/common/FormFields';
import { COMPARISONS } from 'src/utils/comparisons';
import {
  composeValidators,
  draftValidationWrapper,
  minValue,
  required,
} from 'src/utils/validators';
import { Card, Flex, Heading, Label, Text } from 'theme-ui';
import {
  LIBRARY_MIN_REQUIRED_STEPS,
  LIBRARY_TITLE_MAX_LENGTH,
  LIBRARY_TITLE_MIN_LENGTH,
  STEP_DESCRIPTION_MAX_LENGTH,
  STEP_DESCRIPTION_MIN_LENGTH,
} from '../../constants';
import { buttons, errors, steps } from '../../labels';

interface IProps {
  name: string;
  index: number;
  images: MediaWithPublicUrl[];
  onDelete: (index: number) => void;
  moveStep: (indexfrom: number, indexTo: number) => void;
  contentType?: 'projects' | 'research' | 'questions' | 'news';
  contentId?: number | null;
}

/**
 * Ensure that the project description meets the following criteria:
 * - required
 * - minimum character length of 100 characters
 * - maximum character length of 1000 characters
 */
export const LibraryStepField = ({
  name,
  index,
  images,
  onDelete,
  moveStep,
  contentType = 'projects',
  contentId = null,
}: IProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggleDeleteModal = () => {
    setShowDeleteModal((state) => !state);
  };

  const confirmDelete = () => {
    toggleDeleteModal();
    onDelete(index);
  };

  const validateStepMedia = (allValues: any) => {
    if (!allValues?.steps || !allValues?.steps.length) {
      return null;
    }

    const stepValues = allValues.steps[index];
    if (!stepValues) {
      return null;
    }

    // More robust checking for images - ensure array exists AND has items
    const hasImages = Array.isArray(stepValues.images) && stepValues.images.length > 0;

    if (stepValues.videoUrl) {
      if (hasImages) {
        return errors.videoUrl.both;
      }

      const ytRegex = new RegExp(/(youtu\.be\/|youtube\.com\/(watch\?v=|embed\/|v\/))/gi);
      const urlValid = ytRegex.test(stepValues.videoUrl);
      return urlValid ? null : errors.videoUrl.invalidUrl;
    }

    return hasImages ? null : errors.videoUrl.empty;
  };

  const { deleteButton } = buttons.steps;
  const _labelStyle = {
    fontSize: 2,
    marginBottom: 2,
  };

  const isAboveMinimumStep = index >= LIBRARY_MIN_REQUIRED_STEPS;

  return (
    <Card data-cy={`step_${index}`} key={index}>
      <Flex p={3} sx={{ flexDirection: 'column' }}>
        <Flex p={0}>
          <Heading as="h3" variant="small" sx={{ flex: 1 }} mb={3}>
            {steps.heading.title} {index + 1} {!isAboveMinimumStep && '*'}
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
              onClick={() => moveStep(index, index - 1)}
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
            onClick={() => moveStep(index, index + 1)}
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

          <Modal onDismiss={() => toggleDeleteModal()} isOpen={!!showDeleteModal}>
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

        <Flex sx={{ flexDirection: 'column', gap: '1rem' }}>
          <Flex sx={{ flexDirection: 'column' }}>
            <Label sx={_labelStyle} htmlFor={`${name}.title`}>
              {`${steps.title.title} *`}
            </Label>
            <Field
              name={`${name}.title`}
              data-cy="step-title"
              data-testid="step-title"
              modifiers={{ capitalize: true, trim: true }}
              component={FieldInput}
              placeholder={steps.title.placeholder}
              maxLength={LIBRARY_TITLE_MAX_LENGTH}
              minLength={LIBRARY_TITLE_MIN_LENGTH}
              validate={(value, allValues) =>
                draftValidationWrapper(
                  value,
                  allValues,
                  composeValidators(required, minValue(LIBRARY_TITLE_MIN_LENGTH)),
                )
              }
              validateFields={[]}
              isEqual={COMPARISONS.textInput}
              showCharacterCount
            />
          </Flex>

          <Flex sx={{ flexDirection: 'column' }}>
            <Label sx={_labelStyle} htmlFor={`${name}.text`}>
              {`${steps.description.title} *`}
            </Label>
            <Field
              name={`${name}.description`}
              placeholder={steps.description.placeholder}
              minLength={STEP_DESCRIPTION_MIN_LENGTH}
              maxLength={STEP_DESCRIPTION_MAX_LENGTH}
              data-cy="step-description"
              data-testid="step-description"
              modifiers={{ capitalize: true, trim: true }}
              component={FieldTextarea}
              rows={10}
              validate={(value, allValues) =>
                draftValidationWrapper(
                  value,
                  allValues,
                  composeValidators(required, minValue(STEP_DESCRIPTION_MIN_LENGTH)),
                )
              }
              validateFields={[]}
              isEqual={COMPARISONS.textInput}
              showCharacterCount
            />
          </Flex>

          <StepImagesField
            stepIndex={index}
            contentType={contentType}
            contentId={contentId}
            images={images}
            fieldName={name}
          />

          <Flex sx={{ flexDirection: 'column' }}>
            <Field
              name={`${name}.videoUrl`}
              data-cy="step-videoUrl"
              data-testid="step-videoUrl"
              component={FieldInput}
              placeholder={steps.videoUrl.placeholder}
              validate={(_, allValues) => validateStepMedia(allValues)}
              isEqual={COMPARISONS.textInput}
            />
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};
