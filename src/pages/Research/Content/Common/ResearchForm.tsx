import arrayMutators from 'final-form-arrays';
import { Button, ResearchEditorOverview } from 'oa-components';
import {
  type ResearchFormData,
  type ResearchItem,
  type ResearchStatus,
  ResearchStatusRecord,
} from 'oa-shared';
import { useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { FormWrapper } from 'src/common/Form/FormWrapper';
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog';
import { useToast } from 'src/common/Toast';
import { TagsField } from 'src/pages/common/FormFields';
import { ImageField } from 'src/pages/common/FormFields/ImageField';
import { errorSet } from 'src/pages/Library/Content/utils/transformLibraryErrors';
import { ResearchPostingGuidelines } from 'src/pages/Research/Content/Common';
import { buttons, headings, overview } from '../../labels';
import { researchService } from '../../research.service';
import { ResearchCollaboratorsField } from './FormFields/ResearchCollaboratorsField';
import { ResearchDescriptionField } from './FormFields/ResearchDescriptionField';
import { ResearchTitleField } from './FormFields/ResearchTitleField';
import ResearchFieldCategory from './ResearchCategorySelect';

interface IProps {
  id: number | null;
  formData: ResearchFormData | null;
  research: ResearchItem | null;
}

const ResearchForm = ({ id, formData, research }: IProps) => {
  const toast = useToast();
  const [status, setStatus] = useState<ResearchStatus | undefined>(research?.status || undefined);

  const initialValues = useMemo<ResearchFormData>(
    () =>
      ({
        title: formData?.title || '',
        description: formData?.description || '',
        category: formData?.category || null,
        collaborators: formData?.collaborators || [],
        tags: formData?.tags || [],
        coverImage: formData?.coverImage || null,
      }) satisfies ResearchFormData,
    [],
  );

  const updateStatus = async (status: ResearchStatus) => {
    const promise = researchService.updateResearchStatus(id!, status);
    toast.promise(promise, {
      loading: 'Updating research status...',
      success: () => {
        setStatus(status);
        return {
          message: `Status changed to "${ResearchStatusRecord[status]}"`,
          actionLink: {
            href: `/research/${research!.slug}`,
            label: 'View research',
          },
        };
      },
      error: (error) => {
        console.error(error);
        return `Error: ${error.message}`;
      },
    });
  };

  const onSubmit = async (values: ResearchFormData, isDraft = false) => {
    const promise = researchService.upsert(id || null, values, isDraft);

    toast.promise(promise, {
      loading: isDraft ? 'Saving draft...' : 'Publishing research...',
      success: (data) => {
        return {
          message: isDraft ? 'Draft saved!' : 'Research published!',
          actionLink: {
            href: `/research/${data.research.slug}`,
            label: isDraft ? 'View draft' : 'View research',
          },
        };
      },
      error: (error) => {
        console.error(error);
        return `Error: ${error.message}`;
      },
      duration: 10000,
    });
  };

  const heading = id ? headings.overview.edit : headings.overview.create;

  return (
    <Form<ResearchFormData>
      onSubmit={async (values) => await onSubmit(values)}
      initialValues={initialValues}
      mutators={{
        ...arrayMutators,
      }}
      validate={(values) => {
        const errors = {};
        if (values.coverImage == null) {
          errors['coverImage'] = 'Cover image is required.';
        }
        return errors;
      }}
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
        const errorsClientSide = [errorSet(errors, overview)];

        const handleSubmitDraft = async (e: React.MouseEvent) => {
          e.preventDefault();
          await onSubmit(values, true);
        };

        const sidebar = (
          <>
            {id && (
              <Button
                data-cy="draft"
                onClick={() => updateStatus(status === 'complete' ? 'in-progress' : 'complete')}
                variant={status === 'complete' ? 'info' : 'success'}
                type="submit"
                disabled={!id}
                sx={{
                  width: '100%',
                  display: 'block',
                }}
              >
                <span>
                  {status === 'complete' ? buttons.markInProgress : buttons.markCompleted}
                </span>
              </Button>
            )}

            {research?.updates && (
              <ResearchEditorOverview
                updates={research?.updates
                  .filter((u) => !u.deleted)
                  .map((u) => ({
                    isActive: false,
                    isDraft: u.isDraft,
                    title: u.title,
                    id: u.id,
                  }))}
                researchSlug={research?.slug}
                showCreateUpdateButton={true}
              />
            )}
          </>
        );

        const unsavedChangesDialog = (
          <UnsavedChangesDialog hasChanges={dirty && !submitSucceeded} />
        );

        return (
          <FormWrapper
            buttonLabel={buttons.publish}
            contentType="research"
            errorsClientSide={errorsClientSide}
            errorSubmitting={null}
            guidelines={<ResearchPostingGuidelines />}
            handleSubmit={handleSubmit}
            handleSubmitDraft={handleSubmitDraft}
            hasValidationErrors={hasValidationErrors}
            heading={heading}
            sidebar={sidebar}
            submitFailed={submitFailed}
            submitting={submitting}
            unsavedChangesDialog={unsavedChangesDialog}
          >
            <ResearchTitleField />
            <ResearchDescriptionField />
            <ResearchFieldCategory />
            <TagsField title={overview.tags.title} />
            <ResearchCollaboratorsField />
            <ImageField title="Cover Image" contentType="research" contentId={id} />
          </FormWrapper>
        );
      }}
    />
  );
};

export default ResearchForm;
