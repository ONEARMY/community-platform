import type { NewsFormData } from 'oa-shared';
import { useCallback, useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { FormWrapper } from 'src/common/Form/FormWrapper';
import type { MainFormAction } from 'src/common/Form/types';
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog';
import { useToast } from 'src/common/Toast';
import { logger } from 'src/logger';
import { CategoryField } from 'src/pages/common/FormFields/Category.field';
import { EmailContentReachNewsField } from 'src/pages/common/FormFields/EmailContentReachNewsField';
import { ProfileBadgeField } from 'src/pages/common/FormFields/ProfileBadgeField';
import { TagsField } from 'src/pages/common/FormFields/Tags.field';
import { TitleField } from 'src/pages/common/FormFields/Title.field';
import { errorSet } from 'src/pages/Library/Content/utils/transformLibraryErrors';
import { NewsPostingGuidelines } from 'src/pages/News/Content/Common/NewsPostingGuidelines';
import * as LABELS from 'src/pages/News/labels';
import { newsService } from 'src/services/newsService';
import { storageService } from 'src/services/storageService';
import { fireConfetti } from 'src/utils/fireConfetti';
import { composeValidators, minValue, required } from 'src/utils/validators';
import { Flex } from 'theme-ui';
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
  const toast = useToast();
  const [isSubmittingDraft, setIsSubmittingDraft] = useState(false);

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
        emailContentReach: props.formData?.emailContentReach || null,
      }) satisfies NewsFormData,
    [],
  );

  const onSubmit = async (formValues: Partial<NewsFormData>, isDraft = false) => {
    const promise = newsService.upsert(props.id, {
      body: formValues.body!,
      category: formValues.category || null,
      heroImage: formValues.heroImage || null,
      isDraft,
      profileBadge: formValues.profileBadge || null,
      tags: formValues.tags,
      title: formValues.title!,
      emailContentReach: formValues.emailContentReach!,
    });

    toast.promise(promise, {
      loading: isDraft ? 'Saving draft news...' : 'Publishing news...',
      success: (data) => {
        !isDraft && fireConfetti();
        return {
          message: isDraft ? 'Draft news saved' : 'News published',
          actionLink: {
            href: '/news/' + data.slug,
            label: isDraft ? 'View draft news' : 'View news',
          },
        };
      },
      error: (error) => {
        console.error(error);
        return `Error: ${error.message}`;
      },
      duration: 10000,
    });

    await new Promise((resolve) => setTimeout(resolve, 1000)); // to avoid spam clicking
  };

  const imageUpload = useCallback(
    async (imageFile: File) => {
      if (!imageFile) {
        return null;
      }
      try {
        const response = await storageService.imageUpload(props.id, 'news', imageFile);
        return response || null;
      } catch (_) {
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

  const shouldDisableEmailContentReach = !!(
    props.id &&
    props.formData?.emailContentReach &&
    props.formData?.isDraft === false
  );

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
        const validate = composeValidators(required, minValue(NEWS_MIN_TITLE_LENGTH));

        return (
          <FormWrapper
            buttonLabel={LABELS.buttons[props.formAction]}
            errorsClientSide={errorsClientSide}
            guidelines={<NewsPostingGuidelines />}
            handleSubmit={handleSubmit}
            handleSubmitDraft={handleSubmitDraft}
            hasValidationErrors={hasValidationErrors}
            heading={LABELS.headings[props.formAction]}
            sidebar={
              <NewsPreviewEmailButton
                submitting={submitting}
                formValues={values}
                isSubmittingDraft={isSubmittingDraft}
              />
            }
            hideSubmittingMessage={true}
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
              image={values.heroImage}
              removeImage={removeImage}
              contentId={props.id || null}
            />
            <CategoryField type="news" />
            <TagsField title={LABELS.fields.tags.title} />
            <Flex sx={{ flexDirection: 'column', paddingY: 4, gap: 2 }}>
              <ProfileBadgeField
                description={LABELS.fields.profileBadge.description as string}
                placeholder={LABELS.fields.profileBadge.placeholder as string}
                title={LABELS.fields.profileBadge.title}
              />
              <EmailContentReachNewsField
                placeholder={LABELS.fields.contentReach.placeholder as string}
                title={LABELS.fields.contentReach.title}
                shouldDisableEmailContentReach={shouldDisableEmailContentReach}
              />
            </Flex>
            <NewsBodyField imageUpload={imageUpload} />
          </FormWrapper>
        );
      }}
    />
  );
};
