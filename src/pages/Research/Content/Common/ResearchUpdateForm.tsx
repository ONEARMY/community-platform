import { Button, ConfirmModal, ResearchEditorOverview } from 'oa-components';
import type { ResearchItem, ResearchUpdate, ResearchUpdateFormData } from 'oa-shared';
import { useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { useNavigate } from 'react-router';
import { FormWrapper } from 'src/common/Form/FormWrapper';
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog';
import { logger } from 'src/logger';
import { errorSet } from 'src/pages/Library/Content/utils/transformLibraryErrors';
import { fireConfetti } from 'src/utils/fireConfetti';
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
  const navigate = useNavigate();
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [intentionalNavigation, setIntentionalNavigation] = useState(false);

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
    if (isSaving) {
      return;
    }
    setIsSaving(true);
    setIntentionalNavigation(true);
    setSaveErrorMessage(undefined);

    try {
      const result = await researchService.upsertUpdate(research.id, id, formData, isDraft);

      if (!isDraft) {
        fireConfetti();
      }

      if (result) {
        setTimeout(() => {
          navigate(`/research/${research.slug}#update_${result.researchUpdate.id}`);
        }, 100);
      }
    } catch (error) {
      setSaveErrorMessage(error.message);
      logger.error(error);
      setIsSaving(false);
    }
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
          handleSubmit,
          hasValidationErrors,
          errors,
          submitFailed,
          submitSucceeded,
          submitting,
          values,
        }) => {
          const errorsClientSide = [errorSet(errors, updateForm)];

          const handleSubmitDraft = () => onSubmit(values, true);

          const unsavedChangesDialog = (
            <UnsavedChangesDialog
              hasChanges={dirty && !submitSucceeded && !intentionalNavigation}
            />
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
                  disabled={isSaving || submitting}
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
              contentType="researchUpdate"
              errorsClientSide={errorsClientSide}
              errorSubmitting={saveErrorMessage}
              handleSubmit={handleSubmit}
              handleSubmitDraft={handleSubmitDraft}
              hasValidationErrors={hasValidationErrors}
              heading={heading}
              sidebar={sidebar}
              submitFailed={submitFailed}
              submitting={submitting}
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
