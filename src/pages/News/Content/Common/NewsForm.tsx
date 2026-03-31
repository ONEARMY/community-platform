import type { NewsFormData } from 'oa-shared';
import { useCallback, useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { useNavigate } from 'react-router';
import { FormWrapper } from 'src/common/Form/FormWrapper';
import type { MainFormAction } from 'src/common/Form/types';
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog';
import { logger } from 'src/logger';
import { CategoryField } from 'src/pages/common/FormFields/Category.field';
import { ProfileBadgeField } from 'src/pages/common/FormFields/ProfileBadgeField';
import { TagsField } from 'src/pages/common/FormFields/Tags.field';
import { TitleField } from 'src/pages/common/FormFields/Title.field';
import { errorSet } from 'src/pages/Library/Content/utils/transformLibraryErrors';
import { NewsPostingGuidelines } from 'src/pages/News/Content/Common/NewsPostingGuidelines';
import * as LABELS from 'src/pages/News/labels';
import { newsService } from 'src/services/newsService';
import { storageService } from 'src/services/storageService';
import { composeValidators, minValue, required } from 'src/utils/validators';
import { NEWS_MIN_TITLE_LENGTH } from '../../constants';
import { NewsBodyField, NewsImageField } from './FormFields';
import { NewsPreviewEmailButton } from './FormFields/NewsPreviewEmailButton';

interface IProps {
  'data-testid'?: string;
  id: number | null;
  formData: NewsFormData | null;
  formAction: MainFormAction;
}

export const NewsForm = (props: IProps) => {
  const navigate = useNavigate();
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | undefined>();
  const [intentionalNavigation, setIntentionalNavigation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = useMemo<NewsFormData>(
    () =>
      ({
        body: props.formData?.body || '',
        category: props.formData?.category || null,
        heroImage: props.formData?.heroImage || null,
        isDraft: props.formData?.isDraft || null,
        profileBadge: props.formData?.profileBadge || null,
        tags: props.formData?.tags || [],
        title: props.formData?.title || '',
      }) satisfies NewsFormData,
    [],
  );

  const onSubmit = async (formValues: Partial<NewsFormData>, isDraft = false) => {
    setIntentionalNavigation(true);
    setSaveErrorMessage(undefined);
    setIsSubmitting(true);

    try {
      const result = await newsService.upsert(props.id, {
        body: formValues.body!,
        category: formValues.category || null,
        heroImage: formValues.heroImage || null,
        isDraft: isDraft,
        profileBadge: formValues.profileBadge || null,
        tags: formValues.tags,
        title: formValues.title!,
      });

      if (result) {
        navigate('/news/' + result.slug);
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

  const imageUpload = useCallback(
    async (imageFile: File) => {
      if (!imageFile) {
        return null;
      }
      try {
        const response = await storageService.imageUpload(props.id, 'news', imageFile);
        return response || null;
      } catch (e) {
        if (e.cause && e.message) {
          setSaveErrorMessage(e.message);
        }
        logger.error(e);
        return null;
      }
    },
    [props.id],
  );

  const validateForm = useCallback((values) => {
    const errors = {};
    if (!values.body?.length) {
      errors['body'] = 'Body field required. Gotta have something to say...';
    }
    if (values.heroImage == null && values.existingHeroImage === null) {
      errors['heroImage'] = 'An image is required (either new or existing).';
    }
    return errors;
  }, []);

  return (
    <Form
      key={props.id || 'new'}
      data-testid={props['data-testid']}
      onSubmit={(values) => onSubmit(values, false)}
      initialValues={initialValues}
      validate={validateForm}
      render={({
        dirty,
        errors,
        form,
        hasValidationErrors,
        submitFailed,
        submitting,
        submitSucceeded,
        handleSubmit,
        values,
      }) => {
        const removeImage = () => {
          form.change('heroImage', null);
        };

        const errorsClientSide = [errorSet(errors, LABELS.fields)];

        const handleSubmitDraft = async (e: React.MouseEvent) => {
          e.preventDefault();
          await onSubmit(values, true);
        };

        const unsavedChangesDialog = (
          <UnsavedChangesDialog hasChanges={dirty && !submitSucceeded && !intentionalNavigation} />
        );
        const validate = composeValidators(required, minValue(NEWS_MIN_TITLE_LENGTH));

        return (
          <FormWrapper
            buttonLabel={LABELS.buttons[props.formAction]}
            contentType="news"
            errorsClientSide={errorsClientSide}
            errorSubmitting={saveErrorMessage}
            guidelines={<NewsPostingGuidelines />}
            handleSubmit={handleSubmit}
            handleSubmitDraft={handleSubmitDraft}
            hasValidationErrors={hasValidationErrors}
            heading={LABELS.headings[props.formAction]}
            sidebar={
              <NewsPreviewEmailButton
                submitting={submitting}
                formValues={values}
                setSaveErrorMessage={setSaveErrorMessage}
              />
            }
            submitFailed={submitFailed}
            submitting={submitting || isSubmitting}
            unsavedChangesDialog={unsavedChangesDialog}
          >
            <TitleField
              placeholder={LABELS.fields.title.placeholder}
              validate={validate}
              title={LABELS.fields.title.title}
            />
            <NewsImageField
              image={values.heroImage}
              removeImage={removeImage}
              contentId={props.id || null}
            />
            <CategoryField type="news" />
            <TagsField title={LABELS.fields.tags.title} />
            <ProfileBadgeField
              placeholder={LABELS.fields.profileBadge.placeholder as string}
              title={LABELS.fields.profileBadge.title}
            />
            <NewsBodyField imageUpload={imageUpload} />
          </FormWrapper>
        );
      }}
    />
  );
};
