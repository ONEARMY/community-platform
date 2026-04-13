import arrayMutators from 'final-form-arrays';
import type { ProjectFormData } from 'oa-shared';
import { useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { FormWrapper } from 'src/common/Form/FormWrapper';
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog';
import { useToast } from 'src/common/Toast';
import { FilesFields } from 'src/pages/common/FormFields/FilesFields';
import { ImageField } from 'src/pages/common/FormFields/ImageField';
import { TagsField } from 'src/pages/common/FormFields/Tags.field';
import { Flex } from 'theme-ui';
import { buttons, headings, intro } from '../../labels';
import { libraryService } from '../../library.service';
import { transformLibraryErrors } from '../utils';
import DeleteProjectButton from './DeleteProjectButton';
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
  const toast = useToast();
  const [isSubmittingDraft, setIsSubmittingDraft] = useState(false);

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
    const promise = libraryService.upsert(id || null, values, isDraft);

    toast.promise(promise, {
      loading: isDraft ? 'Saving draft...' : 'Publishing project...',
      success: (data) => {
        return {
          message: isDraft ? 'Draft saved!' : 'Project published!',
          actionLink: {
            href: `/library/${data.project.slug}`,
            label: isDraft ? 'View draft' : 'View project',
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
    <Form<ProjectFormData>
      onSubmit={async (values) => await onSubmit(values, false)}
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

        const errorsClientSide = transformLibraryErrors(errors);

        const handleSubmitDraft = async (e: React.MouseEvent) => {
          e.preventDefault();
          setIsSubmittingDraft(true);
          await onSubmit(values, true);
          setIsSubmittingDraft(false);
        };

        const unsavedChangesDialog = (
          <UnsavedChangesDialog hasChanges={dirty && !submitSucceeded} />
        );

        return (
          <FormWrapper
            belowBody={belowBody}
            buttonLabel={buttons.publish}
            errorsClientSide={errorsClientSide}
            guidelines={<LibraryPostingGuidelines />}
            handleSubmit={handleSubmit}
            handleSubmitDraft={handleSubmitDraft}
            hasValidationErrors={hasValidationErrors}
            heading={headingText}
            submitFailed={submitFailed}
            submitting={submitting || isSubmittingDraft}
            hideSubmittingMessage={true}
            sidebar={<>{id && <DeleteProjectButton id={id} />}</>}
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
