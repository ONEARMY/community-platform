import arrayMutators from 'final-form-arrays';
import type { ProjectFormData } from 'oa-shared';
import { useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { useNavigate } from 'react-router';
import { FormWrapper } from 'src/common/Form/FormWrapper';
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog';
import { logger } from 'src/logger';
import { FilesFields } from 'src/pages/common/FormFields/FilesFields';
import { ImageField } from 'src/pages/common/FormFields/ImageField';
import { TagsField } from 'src/pages/common/FormFields/Tags.field';
import { Flex } from 'theme-ui';
import { buttons, headings, intro } from '../../labels';
import { libraryService } from '../../library.service';
import { transformLibraryErrors } from '../utils';
import { LibraryCategoryField } from './LibraryCategory.field';
import { LibraryDescriptionField } from './LibraryDescription.field';
import { LibraryDifficultyField } from './LibraryDifficulty.field';
import { LibraryPostingGuidelines } from './LibraryPostingGuidelines';
import { LibraryStepsContainerField } from './LibraryStepsContainer.field';
import { LibraryTimeField } from './LibraryTime.field';
import { LibraryTitleField } from './LibraryTitle.field';

interface LibraryFormProps {
  id: number | null;
  formData: ProjectFormData | null;
}

export const LibraryForm = ({ id, formData }: LibraryFormProps) => {
  const navigate = useNavigate();
  const [intentionalNavigation, setIntentionalNavigation] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingAsDraft, setIsSavingAsDraft] = useState(false);

  const initialValues = useMemo<ProjectFormData>(
    () =>
      ({
        title: formData?.title || '',
        description: formData?.description || '',
        category: formData?.category || null,
        tags: formData?.tags || [],
        time: formData?.time || null,
        difficultyLevel: formData?.difficultyLevel || null,
        coverImage: formData?.coverImage || null,
        files: formData?.files || null,
        fileLink: formData?.fileLink || null,
        steps: formData?.steps ?? [
          { id: null, title: '', description: '', images: [], videoUrl: null },
          { id: null, title: '', description: '', images: [], videoUrl: null },
          { id: null, title: '', description: '', images: [], videoUrl: null },
        ],
      }) satisfies ProjectFormData,
    [],
  );

  const headingText = id ? headings.edit : headings.create;

  const onSubmit = async (values: ProjectFormData, isDraft = false) => {
    setIntentionalNavigation(true);
    setSaveErrorMessage(undefined);
    setIsSubmitting(true);
    setIsSavingAsDraft(isDraft);

    try {
      if (!isDraft) {
        if (!values.category?.value) {
          const error = 'Category is required';
          setSaveErrorMessage(error);
          throw new Error(error);
        } else if (!values.coverImage?.id) {
          const error = 'The Cover Image is required';
          setSaveErrorMessage(error);
          throw new Error(error);
        }
      }

      const result = await libraryService.upsert(id || null, values, isDraft);

      setTimeout(() => {
        navigate(`/library/${result.project.slug}`);
      }, 100);
    } catch (e) {
      if (e.cause && e.message) {
        setSaveErrorMessage(e.message);
      }
      logger.error(e);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form<ProjectFormData>
      onSubmit={(values) => onSubmit(values, false)}
      initialValues={initialValues}
      mutators={{
        ...arrayMutators,
      }}
      enableReinitialize={true}
      render={({
        errors,
        dirty,
        handleSubmit,
        hasValidationErrors,
        submitFailed,
        submitSucceeded,
        submitting,
        values,
      }) => {
        const belowBody = (
          <Flex sx={{ flexDirection: 'column' }}>
            <LibraryStepsContainerField contentType="projects" contentId={id ?? null} />
          </Flex>
        );

        const errorsClientSide = transformLibraryErrors(errors, isSavingAsDraft);

        const handleSubmitDraft = async (e: React.MouseEvent) => {
          e.preventDefault();
          await onSubmit(values, true);
        };

        const unsavedChangesDialog = (
          <UnsavedChangesDialog hasChanges={dirty && !submitSucceeded && !intentionalNavigation} />
        );

        return (
          <FormWrapper
            belowBody={belowBody}
            buttonLabel={buttons.publish}
            contentType="research"
            errorsClientSide={errorsClientSide}
            errorSubmitting={saveErrorMessage}
            guidelines={<LibraryPostingGuidelines />}
            handleSubmit={handleSubmit}
            handleSubmitDraft={handleSubmitDraft}
            hasValidationErrors={hasValidationErrors}
            heading={headingText}
            submitFailed={submitFailed}
            submitting={submitting || isSubmitting}
            unsavedChangesDialog={unsavedChangesDialog}
          >
            <Flex
              sx={{
                gap: 4,
                flexDirection: ['column', 'row'],
              }}
            >
              <Flex sx={{ flexDirection: 'column', gap: '1rem', flex: 1 }}>
                <LibraryTitleField />
                <LibraryDescriptionField />
                <LibraryCategoryField />
                <LibraryTimeField />
                <LibraryDifficultyField />
                <TagsField title={intro.tags.title} />
                <FilesFields contentType="projects" contentId={id ?? null} />
              </Flex>
              <Flex data-cy="intro-cover" sx={{ flex: 1, width: '100%' }}>
                <ImageField title="Cover Image" contentType="projects" contentId={id ?? null} />
              </Flex>
            </Flex>
          </FormWrapper>
        );
      }}
    />
  );
};
