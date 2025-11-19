import { useEffect, useState } from 'react';
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
  const [initialValues, setInitialValues] = useState<NewsFormData>({
    body: '',
    category: null,
    existingHeroImage: null,
    isDraft: null,
    heroImage: null,
    profileBadge: null,
    tags: [],
    title: '',
  });
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [intentionalNavigation, setIntentionalNavigation] = useState(false);

  const id = news?.id || null;

  useEffect(() => {
    if (!news) {
      return;
    }

    setInitialValues({
      body: news.body,
      category: news.category
        ? {
            value: news.category.id?.toString(),
            label: news.category.name,
          }
        : null,
      existingHeroImage: news.heroImage,
      isDraft: news.isDraft,
      heroImage: null,
      profileBadge: news.profileBadge
        ? {
            value: news.profileBadge.id?.toString(),
            label: news.profileBadge.displayName,
          }
        : null,

      tags: news.tagIds,
      title: news.title,
    });
  }, [news]);

  const onSubmit = async (formValues: Partial<NewsFormData>, isDraft = false) => {
    setIntentionalNavigation(true);
    setSaveErrorMessage(null);

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
    }
  };

  const imageUpload = async (imageFile: File) => {
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
  };

  const removeExistingImage = () => {
    setInitialValues((prevState: NewsFormData) => {
      return {
        ...prevState,
        existingHeroImage: null,
        heroImage: null,
      };
    });
  };

  return (
    <Form
      data-testid={props['data-testid']}
      onSubmit={(values) => onSubmit(values, false)}
      initialValues={initialValues}
      validate={(values) => {
        const errors = {};
        if (!values.body?.length) {
          errors['body'] = 'Body field required. Gotta have something to say...';
        }
        if (values.heroImage == null && values.existingHeroImage === null) {
          errors['heroImage'] = 'An image is required (either new or existing).';
        }
        return errors;
      }}
      render={({
        dirty,
        errors,
        hasValidationErrors,
        submitFailed,
        submitting,
        submitSucceeded,
        handleSubmit,
        values,
      }) => {
        const errorsClientSide = [errorSet(errors, LABELS.fields)];

        const handleSubmitDraft = () => onSubmit(values, true);

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
            submitting={submitting}
            unsavedChangesDialog={unsavedChangesDialog}
          >
            <TitleField
              placeholder={LABELS.fields.title.placeholder}
              validate={validate}
              title={LABELS.fields.title.title}
            />
            <NewsImageField
              existingHeroImage={initialValues.existingHeroImage}
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
