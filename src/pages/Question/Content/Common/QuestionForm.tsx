import type { QuestionFormData } from 'oa-shared';
import { useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { FormWrapper } from 'src/common/Form/FormWrapper';
import type { MainFormAction } from 'src/common/Form/types';
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog';
import { useToast } from 'src/common/Toast';
import { CategoryField, TagsField, TitleField } from 'src/pages/common/FormFields';
import { errorSet } from 'src/pages/Library/Content/utils/transformLibraryErrors';
import { QuestionPostingGuidelines } from 'src/pages/Question/Content/Common';
import {
  QuestionDescriptionField,
  QuestionImagesField,
} from 'src/pages/Question/Content/Common/FormFields';
import * as LABELS from 'src/pages/Question/labels';
import { questionService } from 'src/services/questionService';
import { composeValidators, endsWithQuestionMark, minValue, required } from 'src/utils/validators';
import { QUESTION_MAX_IMAGES, QUESTION_MIN_TITLE_LENGTH } from '../../constants';

interface IProps {
  'data-testid'?: string;
  id: number | null;
  formData: QuestionFormData | null;
  formAction: MainFormAction;
}

export const QuestionForm = (props: IProps) => {
  const toast = useToast();
  const [isSubmittingDraft, setIsSubmittingDraft] = useState(false);
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
    const promise = questionService.upsert(id, {
      title: formValues.title!,
      description: formValues.description!,
      tags: formValues.tags || null,
      category: formValues.category || null,
      images: formValues.images || null,
      isDraft: isDraft,
    });

    toast.promise(promise, {
      loading: isDraft ? 'Saving draft...' : 'Submitting question...',
      success: (data) => {
        return {
          message: isDraft ? 'Draft saved!' : 'Question submitted!',
          actionLink: {
            href: `/questions/${data.slug}`,
            label: isDraft ? 'View draft' : 'View question',
          },
        };
      },
      error: (error) => {
        console.error(error);
        return `Error: ${error.message}`;
      },
      duration: 10000,
    });

    await promise;

    await new Promise((resolve) => setTimeout(resolve, 1000)); // to avoid spam clicking
  };

  return (
    <Form
      data-testid={props['data-testid']}
      onSubmit={async (values) => await onSubmit(values, false)}
      initialValues={initialValues}
      render={({
        errors,
        dirty,
        handleSubmit,
        hasValidationErrors,
        submitFailed,
        submitting,
        form,
        submitSucceeded,
        values,
      }) => {
        const errorsClientSide = [errorSet(errors, LABELS.fields)];

        const handleSubmitDraft = async () => {
          setIsSubmittingDraft(true);
          try {
            await onSubmit(values, true);
            form.reset(values);
          } finally {
            setIsSubmittingDraft(false);
          }
        };

        const unsavedChangesDialog = (
          <UnsavedChangesDialog hasChanges={dirty && !submitSucceeded} />
        );

        const validate = composeValidators(
          required,
          minValue(QUESTION_MIN_TITLE_LENGTH),
          endsWithQuestionMark(),
        );

        return (
          <FormWrapper
            buttonLabel={LABELS.buttons[props.formAction]}
            errorsClientSide={errorsClientSide}
            guidelines={<QuestionPostingGuidelines />}
            handleSubmit={handleSubmit}
            handleSubmitDraft={handleSubmitDraft}
            hasValidationErrors={hasValidationErrors}
            heading={LABELS.headings[props.formAction]}
            submitFailed={submitFailed}
            submitting={submitting || isSubmittingDraft}
            hideSubmittingMessage={true}
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
