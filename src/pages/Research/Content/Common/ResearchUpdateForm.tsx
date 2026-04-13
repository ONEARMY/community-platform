import { Button, ConfirmModal, ResearchEditorOverview } from 'oa-components';
import type { ResearchItem, ResearchUpdate, ResearchUpdateFormData } from 'oa-shared';
import { useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { FormWrapper } from 'src/common/Form/FormWrapper';
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog';
import { useToast } from 'src/common/Toast/useToast';
import { errorSet } from 'src/pages/Library/Content/utils/transformLibraryErrors';
import { FilesFields } from '../../../common/FormFields/FilesFields';
import { buttons, headings, updateForm } from '../../labels';
import { researchService } from '../../research.service';
import { DescriptionField } from '../CreateResearch/Form/DescriptionField';
import { ResearchImagesField } from '../CreateResearch/Form/ResearchImagesField';
import { TitleField } from '../CreateResearch/Form/TitleField';
import VideoUrlField from '../CreateResearch/Form/VideoUrlField';

interface IProps {
  id: number | null;
  formData: ResearchUpdateFormData | null;
  research: ResearchItem;
}

export const ResearchUpdateForm = ({ id, formData, research }: IProps) => {
  const toast = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const initialValues = useMemo<ResearchUpdateFormData>(
    () =>
      ({
        title: formData?.title || '',
        description: formData?.description || '',
        images: formData?.images || null,
        files: formData?.files || null,
        fileLink: formData?.fileLink || null,
        videoUrl: formData?.videoUrl || '',
      }) satisfies ResearchUpdateFormData,
    [],
  );

  const onSubmit = async (formData: ResearchUpdateFormData, isDraft = false) => {
    const promise = researchService.upsertUpdate(research.id, id, formData, isDraft);

    toast.promise(promise, {
      loading: isDraft ? 'Saving draft...' : 'Publishing research update...',
      success: (data) => {
        return {
          message: isDraft ? 'Draft saved!' : 'Research update published!',
          actionLink: {
            href: `/research/${research.slug}#update_${data.researchUpdate.id}`,
            label: isDraft ? 'View draft' : 'View research update',
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

  const handleDelete = async () => {
    if (!id) {
      return;
    }
    setShowDeleteModal(false);
    await researchService.deleteUpdate(research.id, id);
    window.location.assign('/research/' + research.slug);
  };

  const isEdit = !!id;
  const heading = isEdit ? headings.update.edit : headings.update.create;

  return (
    <>
      <Form<ResearchUpdateFormData>
        onSubmit={async (values) => await onSubmit(values)}
        initialValues={initialValues}
        render={({
          dirty,
          form,
          handleSubmit,
          hasValidationErrors,
          errors,
          submitFailed,
          submitSucceeded,
          submitting,
          values,
        }) => {
          const errorsClientSide = [errorSet(errors, updateForm)];

          const handleSubmitDraft = async () => {
            await onSubmit(values, true);
            form.reset(values);
          };

          const unsavedChangesDialog = (
            <UnsavedChangesDialog hasChanges={dirty && !submitSucceeded} />
          );

          const sidebar = (
            <>
              {isEdit ? (
                <Button
                  data-cy="delete"
                  onClick={(evt) => {
                    setShowDeleteModal(true);
                    evt.preventDefault();
                  }}
                  variant="destructive"
                  type="submit"
                  disabled={submitting}
                  sx={{ alignSelf: 'stretch', justifyContent: 'center' }}
                >
                  {buttons.deletion.text}
                </Button>
              ) : null}

              {research && (
                <ResearchEditorOverview
                  updates={getResearchUpdates(research.updates || [], !isEdit, values.title)}
                  researchSlug={research?.slug}
                  showCreateUpdateButton={isEdit}
                  showBackToResearchButton={true}
                />
              )}
            </>
          );

          return (
            <FormWrapper
              buttonLabel={buttons.publish}
              errorsClientSide={errorsClientSide}
              handleSubmit={handleSubmit}
              handleSubmitDraft={handleSubmitDraft}
              hasValidationErrors={hasValidationErrors}
              heading={heading}
              sidebar={sidebar}
              submitFailed={submitFailed}
              submitting={submitting}
              hideSubmittingMessage={true}
              unsavedChangesDialog={unsavedChangesDialog}
            >
              <TitleField />
              <DescriptionField />
              <ResearchImagesField contentId={research.id} />
              <VideoUrlField />
              <FilesFields contentType="research" contentId={research.id} />
            </FormWrapper>
          );
        }}
      />
      <ConfirmModal
        isOpen={showDeleteModal}
        message={buttons.deletion.message}
        confirmButtonText={buttons.deletion.confirm}
        handleCancel={() => setShowDeleteModal(false)}
        handleConfirm={handleDelete}
        confirmVariant="destructive"
      />
    </>
  );
};

const getResearchUpdates = (
  updates: ResearchUpdate[],
  isCreating: boolean,
  researchTitle: string,
): any[] =>
  [
    ...updates
      .filter((u) => !u.deleted)
      .map((u) => ({
        title: u.title,
        isDraft: u.isDraft,
        slug: u.id,
        id: u.id,
      })),
    isCreating
      ? {
          title: researchTitle,
          isDraft: true,
          slug: null,
        }
      : null,
  ].filter(Boolean);
