import { useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { useNavigate } from 'react-router';
import { FormWrapper } from 'src/common/Form/FormWrapper';
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

import type { Question, QuestionFormData } from 'oa-shared';
import type { MainFormAction } from 'src/common/Form/types';

interface IProps {
  'data-testid'?: string;
  question: Question | null;
  parentType: MainFormAction;
}

export const QuestionForm = (props: IProps) => {
  const { question, parentType } = props;
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<QuestionFormData>({
    category: null,
    description: '',
    existingImages: [],
    images: [],
    isDraft: false,
    tags: [],
    title: '',
  });
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [intentionalNavigation, setIntentionalNavigation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const id = question?.id || null;

  useEffect(() => {
    if (!question) {
      return;
    }

    setInitialValues({
      category: question.category
        ? {
            value: question.category.id?.toString(),
            label: question.category.name,
          }
        : null,
      description: question.description,
      existingImages: question.images,
      images: null,
      isDraft: question.isDraft,
      tags: question.tagIds,
      title: question.title,
    });
  }, [question]);

  const onSubmit = async (formValues: Partial<QuestionFormData>, isDraft: boolean = false) => {
    setIntentionalNavigation(true);
    setSaveErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await questionService.upsert(id, {
        title: formValues.title!,
        description: formValues.description!,
        tags: formValues.tags,
        category: formValues.category || null,
        images: formValues.images || null,
        isDraft: isDraft,
        existingImages: initialValues.existingImages || null,
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

  const removeExistingImage = (index: number) => {
    setInitialValues((prevState: QuestionFormData) => {
      return {
        ...prevState,
        existingImages: prevState.existingImages?.filter((_, i) => i !== index) ?? null,
      };
    });
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

        const numberOfImageInputsAvailable = (values as any)?.images
          ? Math.min((values as any).images.filter((x) => !!x).length + 1, QUESTION_MAX_IMAGES)
          : 1;

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
            buttonLabel={LABELS.buttons[parentType]}
            contentType="questions"
            errorsClientSide={errorsClientSide}
            errorSubmitting={saveErrorMessage}
            guidelines={<QuestionPostingGuidelines />}
            handleSubmit={handleSubmit}
            handleSubmitDraft={handleSubmitDraft}
            hasValidationErrors={hasValidationErrors}
            heading={LABELS.headings[parentType]}
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
              inputsAvailable={numberOfImageInputsAvailable}
              existingImages={initialValues.existingImages}
              removeExistingImage={removeExistingImage}
            />
            <CategoryField type="questions" />
            <TagsField title={LABELS.fields.tags.title} />
          </FormWrapper>
        );
      }}
    />
  );
};
