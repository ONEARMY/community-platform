import arrayMutators from 'final-form-arrays';
import type { MediaFile, Project, ProjectFormData } from 'oa-shared';
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
  project?: Project;
  files?: MediaFile[];
  fileLink?: string;
}

export const LibraryForm = ({ project, files, fileLink }: LibraryFormProps) => {
  const navigate = useNavigate();
  const [intentionalNavigation, setIntentionalNavigation] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingAsDraft, setIsSavingAsDraft] = useState(false);

  const formValues = useMemo<ProjectFormData>(
    () => ({
      title: project?.title || '',
      description: project?.description || '',
      category: project?.category
        ? {
            value: project.category.id?.toString(),
            label: project.category.name,
          }
        : undefined,
      tags: project?.tagIds || [],
      time: project?.time,
      difficultyLevel: project?.difficultyLevel,
      existingImage: project?.coverImage || null,
      existingFiles: files,
      fileLink: fileLink,
      steps: project?.steps
        ?.slice()
        .sort((a, b) => a.order - b.order)
        .map((x) => ({
          id: x.id,
          title: x.title,
          description: x.description,
          videoUrl: x.videoUrl || undefined,
          images: [],
          existingImages: x.images,
        })) ?? [
        { title: '', description: '', images: [], existingImages: [] },
        { title: '', description: '', images: [], existingImages: [] },
        { title: '', description: '', images: [], existingImages: [] },
      ],
    }),
    [project],
  );

  const headingText = project ? headings.edit : headings.create;

  const onSubmit = async (values: ProjectFormData, isDraft = false) => {
    setIntentionalNavigation(true);
    setSaveErrorMessage(null);
    setIsSubmitting(true);
    setIsSavingAsDraft(isDraft);

    try {
      if (!isDraft) {
        if (!values.category?.value) {
          const error = 'Category is required';
          setSaveErrorMessage(error);
          throw new Error(error);
        } else if (!values.image && !values.existingImage?.id) {
          const error = 'An image is required';
          setSaveErrorMessage(error);
          throw new Error(error);
        }
      }

      const result = await libraryService.upsert(project?.id || null, values, isDraft);

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
      initialValues={formValues}
      mutators={{
        ...arrayMutators,
      }}
      validateOnBlur
      enableReinitialize={true}
      validate={(values) => {
        const errors = {};

        if (!values.category) {
          errors['category'] = 'Category is required.';
        }

        if (!values.image && !values.existingImage) {
          errors['existingImage'] = 'An image is required (either new or existing).';
          errors['image'] = 'An image is required (either new or existing).';
        }

        return errors;
      }}
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
            <LibraryStepsContainerField />
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
          <>
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
                <Flex sx={{ flexDirection: 'column', gap: 2, flex: 1 }}>
                  <LibraryTitleField />
                  <LibraryDescriptionField />
                  <LibraryCategoryField />
                  <TagsField title={intro.tags.title} />
                  <LibraryTimeField />
                  <LibraryDifficultyField />
                  <FilesFields />
                </Flex>
                <Flex data-cy="intro-cover" sx={{ flex: 1, width: '100%' }}>
                  <ImageField title="Cover Image" />
                </Flex>
              </Flex>
            </FormWrapper>
          </>
        );
      }}
    />
  );
};
