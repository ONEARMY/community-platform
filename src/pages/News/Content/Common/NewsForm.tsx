import { useCallback, useState } from 'react';
import { Form } from 'react-final-form';
import { useNavigate } from 'react-router';
import { FormWrapper } from 'src/common/Form/FormWrapper';
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

import type { News, NewsFormData } from 'oa-shared';
import type { MainFormAction } from 'src/common/Form/types';

interface IProps {
  'data-testid'?: string;
  news: News | null;
  parentType: MainFormAction;
}

export const NewsForm = (props: IProps) => {
  const { news, parentType } = props;
  const navigate = useNavigate();

  // Initialize values directly from news to avoid delay from useEffect
  const initialValues: NewsFormData = {
    body: news?.body || '',
    category: news?.category
      ? {
          value: news.category.id?.toString(),
          label: news.category.name,
        }
      : null,
    existingHeroImage: news?.heroImage || null,
    isDraft: news?.isDraft || null,
    heroImage: null,
    profileBadge: news?.profileBadge
      ? {
          value: news.profileBadge.id?.toString(),
          label: news.profileBadge.displayName,
        }
      : null,
    tags: news?.tagIds || [],
    title: news?.title || '',
  };

  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [intentionalNavigation, setIntentionalNavigation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const id = news?.id || null;

  const onSubmit = async (formValues: Partial<NewsFormData>, isDraft = false) => {
    setIntentionalNavigation(true);
    setSaveErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await newsService.upsert(id, {
        body: formValues.body!,
        category: formValues.category || null,
        heroImage: formValues.heroImage || null,
        isDraft: isDraft,
        existingHeroImage: initialValues.existingHeroImage || null,
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
        return;
      }
      try {
        const response = await storageService.imageUpload(id, 'news', imageFile);
        return response.publicUrl;
      } catch (e) {
        if (e.cause && e.message) {
          setSaveErrorMessage(e.message);
        }
        logger.error(e);
      }
    },
    [id],
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
      key={id || 'new'}
      data-testid={props['data-testid']}
      onSubmit={(values) => onSubmit(values, false)}
      initialValues={initialValues}
      validate={validateForm}
      subscription={{
        submitting: true,
        pristine: true,
        hasValidationErrors: true,
        values: true,
        dirty: true,
        errors: true,
        submitFailed: true,
        submitSucceeded: true,
      }}
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
        const removeExistingImage = () => {
          form.change('existingHeroImage', null);
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
            buttonLabel={LABELS.buttons[parentType]}
            contentType="news"
            errorsClientSide={errorsClientSide}
            errorSubmitting={saveErrorMessage}
            guidelines={<NewsPostingGuidelines />}
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
            <NewsImageField
              existingHeroImage={values.existingHeroImage}
              removeExistingImage={removeExistingImage}
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
