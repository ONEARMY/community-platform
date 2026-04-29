import { Button } from 'oa-components';
import type { NewsFormData } from 'oa-shared';
import { useState } from 'react';
import { useToast } from 'src/common/Toast/useToast';
import { emailPreviewService } from 'src/services/emailPreviewService';

interface IProps {
  formValues: Partial<NewsFormData>;
  isSubmittingDraft: boolean;
  submitting: boolean;
}

export const NewsPreviewEmailButton = (props: IProps) => {
  const toast = useToast();
  const { formValues, isSubmittingDraft, submitting } = props;
  const [isSendingPreview, setIsSendingPreview] = useState<boolean>(false);

  const previewEmail = async () => {
    setIsSendingPreview(true);

    const promise = emailPreviewService.send({
      body: formValues.body || '',
      category: formValues.category || null,
      heroImage: formValues.heroImage || null,
      isDraft: false,
      profileBadges: formValues.profileBadges || null,
      tags: formValues.tags,
      title: formValues.title || '',
      emailContentReach: null,
    });

    toast.promise(promise, {
      loading: 'Sending preview news email',
      success: () => {
        return {
          message: 'Preview news email sent',
        };
      },
      error: (error) => {
        console.error(error);
        return `Error: ${error.message}`;
      },
      duration: 10000,
    });
    setIsSendingPreview(false);
  };

  return (
    <Button
      data-cy="previewEmailButton"
      onClick={previewEmail}
      variant="outline"
      type="button"
      disabled={submitting || isSendingPreview || isSubmittingDraft}
      sx={{
        width: '100%',
        display: 'block',
      }}
    >
      Send yourself a preview email
    </Button>
  );
};
