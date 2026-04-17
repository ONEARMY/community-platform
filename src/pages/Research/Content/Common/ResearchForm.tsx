import arrayMutators from 'final-form-arrays';
import { FormApi } from 'node_modules/final-form/dist';
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
import { useToast } from 'src/common/Toast';
import { TagsField } from 'src/pages/common/FormFields';
import { ImageField } from 'src/pages/common/FormFields/ImageField';
import { errorSet } from 'src/pages/Library/Content/utils/transformLibraryErrors';
import { ResearchPostingGuidelines } from 'src/pages/Research/Content/Common';
import { buttons, headings, researchForm } from '../../labels';
import { researchService } from '../../research.service';
import DeleteResearchButton from './DeleteResearchButton';
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
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSubmittingDraft, setIsSubmittingDraft] = useState(false);

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
    setIsUpdatingStatus(true);
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

    try {
      await promise;
    } finally {
      setTimeout(() => {
        // to avoid spam clicking
        setIsUpdatingStatus(false);
      }, 1000);
    }
  };

  const onSubmit = async (
    form: FormApi<ResearchFormData, Partial<ResearchFormData>>,
    values: ResearchFormData,
    isDraft = false,
  ) => {
    const promise = researchService.upsert(id || null, values, isDraft);

    toast.promise(promise, {
      loading: isDraft ? 'Saving draft...' : 'Publishing research...',
      success: (data) => {
        form.reset(values);
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

    await promise;

    await new Promise((resolve) => setTimeout(resolve, 1000)); // to avoid spam clicking
  };

  const heading = id ? headings.overview.edit : headings.overview.create;

  return (
    <Form<ResearchFormData>
      onSubmit={async (values, form) => await onSubmit(form, values)}
      initialValues={initialValues}
      mutators={{
        ...arrayMutators,
      }}
      render={({
        errors,
        dirty,
        form,
        handleSubmit,
        hasValidationErrors,
        submitFailed,
        submitting,
        values,
      }) => {
        const errorsClientSide = [errorSet(errors, researchForm)];

        const handleSubmitDraft = async (e: React.MouseEvent) => {
          e.preventDefault();
          setIsSubmittingDraft(true);
          try {
            await onSubmit(form, values, true);
            form.reset(values);
          } finally {
            setIsSubmittingDraft(false);
          }
        };

        const sidebar = (
          <>
            {id && (
              <Button
                data-cy="draft"
                onClick={() => updateStatus(status === 'complete' ? 'in-progress' : 'complete')}
                variant={status === 'complete' ? 'info' : 'success'}
                type="submit"
                disabled={!id || isUpdatingStatus || submitting || isSubmittingDraft}
                sx={{
                  width: '100%',
                  display: 'block',
                }}
              >
                {status === 'complete' ? buttons.markInProgress : buttons.markCompleted}
              </Button>
            )}

            {research && <DeleteResearchButton research={research} />}

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

        return (
          <FormWrapper
            buttonLabel={buttons.publish}
            errorsClientSide={errorsClientSide}
            guidelines={<ResearchPostingGuidelines />}
            handleSubmit={handleSubmit}
            handleSubmitDraft={handleSubmitDraft}
            hasValidationErrors={hasValidationErrors}
            heading={heading}
            sidebar={sidebar}
            submitFailed={submitFailed}
            submitting={submitting || isSubmittingDraft || isUpdatingStatus}
            hideSubmittingMessage={true}
          >
            <ResearchTitleField />
            <ResearchDescriptionField />
            <ImageField title="Cover Image" contentType="research" contentId={id} />
            <ResearchFieldCategory />
            <TagsField title={researchForm.tags.title} />
            <ResearchCollaboratorsField />
          </FormWrapper>
        );
      }}
    />
  );
};

export default ResearchForm;
