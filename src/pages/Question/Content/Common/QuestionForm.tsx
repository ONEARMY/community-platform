import type { QuestionFormData } from 'oa-shared';
import { useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { useNavigate } from 'react-router';
import { FormWrapper } from 'src/common/Form/FormWrapper';
import type { MainFormAction } from 'src/common/Form/types';
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog';
import { logger } from 'src/logger';
import { CategoryField, TagsField, TitleField } from 'src/pages/common/FormFields';
import { errorSet } from 'src/pages/Library/Content/utils/transformLibraryErrors';
import { QuestionPostingGuidelines } from 'src/pages/Question/Content/Common';
import {
  QuestionDescriptionField,
  QuestionImagesField,
} from 'src/pages/Question/Content/Common/FormFields';
import * as LABELS from 'src/pages/Question/labels';
import { questionService } from 'src/services/questionService';
import { fireConfetti } from 'src/utils/fireConfetti';
import { composeValidators, endsWithQuestionMark, minValue, required } from 'src/utils/validators';
import { QUESTION_MAX_IMAGES, QUESTION_MIN_TITLE_LENGTH } from '../../constants';

interface IProps {
  'data-testid'?: string;
  id: number | null;
  formData: QuestionFormData | null;
  formAction: MainFormAction;
}

export const QuestionForm = (props: IProps) => {
  const navigate = useNavigate();
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [intentionalNavigation, setIntentionalNavigation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const id = props?.id || null;

  const initialValues = useMemo<QuestionFormData>(
    () =>
      ({
        title: props.formData?.title || '',
        description: props.formData?.description || '',
        category: props.formData?.category || null,
        images: props.formData?.images || [],
        tags: props.formData?.tags || null,
        isDraft: props.formData?.isDraft || null,
      }) satisfies QuestionFormData,
    [],
  );

  const onSubmit = async (formValues: Partial<QuestionFormData>, isDraft: boolean = false) => {
    setIntentionalNavigation(true);
    setSaveErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await questionService.upsert(id, {
        title: formValues.title!,
        description: formValues.description!,
        tags: formValues.tags || null,
        category: formValues.category || null,
        images: formValues.images || null,
        isDraft: isDraft,
      });

      if (result) {
        fireConfetti();
        navigate('/questions/' + result.slug);
      }
    } catch (e) {
      if (e.cause && e.message) {
        setSaveErrorMessage(e.message);
      }
      logger.error(e);
      setIsSubmitting(false);
      throw e;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      data-testid={props['data-testid']}
      onSubmit={(values) => onSubmit(values, false)}
      initialValues={initialValues}
      render={({
        errors,
        dirty,
        handleSubmit,
        hasValidationErrors,
        submitFailed,
        submitting,
        submitSucceeded,
        values,
      }) => {
        const errorsClientSide = [errorSet(errors, LABELS.fields)];

        const handleSubmitDraft = async (e: React.MouseEvent) => {
          e.preventDefault();
          await onSubmit(values, true);
        };

        const unsavedChangesDialog = (
          <UnsavedChangesDialog hasChanges={dirty && !submitSucceeded && !intentionalNavigation} />
        );

        const validate = composeValidators(
          required,
          minValue(QUESTION_MIN_TITLE_LENGTH),
          endsWithQuestionMark(),
        );

        return (
          <FormWrapper
            buttonLabel={LABELS.buttons[props.formAction]}
            contentType="questions"
            errorsClientSide={errorsClientSide}
            errorSubmitting={saveErrorMessage}
            guidelines={<QuestionPostingGuidelines />}
            handleSubmit={handleSubmit}
            handleSubmitDraft={handleSubmitDraft}
            hasValidationErrors={hasValidationErrors}
            heading={LABELS.headings[props.formAction]}
            submitFailed={submitFailed}
            submitting={submitting || isSubmitting}
            unsavedChangesDialog={unsavedChangesDialog}
          >
            <TitleField
              placeholder={LABELS.fields.title.placeholder}
              validate={validate}
              title={LABELS.fields.title.title}
            />
            <QuestionDescriptionField />
            <QuestionImagesField
              contentType="questions"
              contentId={id}
              maxImages={QUESTION_MAX_IMAGES}
            />
            <CategoryField type="questions" />
            <TagsField title={LABELS.fields.tags.title} />
          </FormWrapper>
        );
      }}
    />
  );
};
