import arrayMutators from 'final-form-arrays';
import { Button, ResearchEditorOverview } from 'oa-components';
import type { ResearchFormData, ResearchItem, ResearchStatus } from 'oa-shared';
import { useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { useNavigate } from 'react-router';
import { FormWrapper } from 'src/common/Form/FormWrapper';
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog';
import { logger } from 'src/logger';
import { TagsField } from 'src/pages/common/FormFields';
import { ImageField } from 'src/pages/common/FormFields/ImageField';
import { errorSet } from 'src/pages/Library/Content/utils/transformLibraryErrors';
import { ResearchPostingGuidelines } from 'src/pages/Research/Content/Common';
import { fireConfetti } from 'src/utils/fireConfetti';
import { buttons, headings, researchForm } from '../../labels';
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
  const navigate = useNavigate();
  const [intentionalNavigation, setIntentionalNavigation] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    try {
      await researchService.updateResearchStatus(id!, status);
      navigate(`/research/${research!.slug}`);
    } catch (err) {
      console.error(err);
      setSaveErrorMessage('Error updating research status');
    }
  };

  const onSubmit = async (values: ResearchFormData, isDraft = false) => {
    setIntentionalNavigation(true);
    setSaveErrorMessage(undefined);
    setIsSubmitting(true);

    try {
      const result = await researchService.upsert(id || null, values, isDraft);

      if (!isDraft) {
        fireConfetti();
      }

      setTimeout(() => {
        navigate(`/research/${result.research.slug}`);
      }, 100);
    } catch (e) {
      if (e.message) {
        setSaveErrorMessage(e.message);
      }
      logger.error(e);
      setIsSubmitting(false);
      throw e;
    } finally {
      setIsSubmitting(false);
    }
  };

  const heading = id ? headings.overview.edit : headings.overview.create;

  return (
    <Form<ResearchFormData>
      onSubmit={async (values) => await onSubmit(values)}
      initialValues={initialValues}
      mutators={{
        ...arrayMutators,
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
        const errorsClientSide = [errorSet(errors, researchForm)];

        const handleSubmitDraft = async (e: React.MouseEvent) => {
          e.preventDefault();
          await onSubmit(values, true);
        };

        const sidebar = (
          <>
            {id && (
              <Button
                data-cy="draft"
                onClick={() =>
                  updateStatus(research?.status === 'complete' ? 'in-progress' : 'complete')
                }
                variant={research?.status === 'complete' ? 'info' : 'success'}
                type="submit"
                disabled={!id}
                sx={{
                  width: '100%',
                  display: 'block',
                }}
              >
                {research?.status === 'complete' ? buttons.markInProgress : buttons.markCompleted}
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
          <UnsavedChangesDialog hasChanges={dirty && !submitSucceeded && !intentionalNavigation} />
        );

        return (
          <FormWrapper
            buttonLabel={buttons.publish}
            contentType="research"
            errorsClientSide={errorsClientSide}
            errorSubmitting={saveErrorMessage}
            guidelines={<ResearchPostingGuidelines />}
            handleSubmit={handleSubmit}
            handleSubmitDraft={handleSubmitDraft}
            hasValidationErrors={hasValidationErrors}
            heading={heading}
            sidebar={sidebar}
            submitFailed={submitFailed}
            submitting={submitting || isSubmitting}
            unsavedChangesDialog={unsavedChangesDialog}
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
