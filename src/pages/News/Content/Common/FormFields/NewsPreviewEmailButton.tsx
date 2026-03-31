import { Button } from 'oa-components';
import type { NewsFormData } from 'oa-shared';
import { Dispatch, SetStateAction, useState } from 'react';
import { emailPreviewService } from 'src/services/emailPreviewService';

interface IProps {
  formValues: Partial<NewsFormData>;
  setSaveErrorMessage: Dispatch<SetStateAction<string | null>>;
  submitting: boolean;
}

export const NewsPreviewEmailButton = (props: IProps) => {
  const { formValues, setSaveErrorMessage, submitting } = props;
  const [isSendingPreview, setIsSendingPreview] = useState<boolean>(false);

  const previewEmail = async () => {
    setIsSendingPreview(true);

    const draftNews = {
      body: formValues.body || '',
      category: formValues.category || null,
      heroImage: formValues.heroImage || null,
      isDraft: false,
      profileBadge: formValues.profileBadge || null,
      tags: formValues.tags,
      title: formValues.title || '',
    };

    try {
      await emailPreviewService.send(draftNews);
      setTimeout(() => {
        // The preview will send very quick, adding this to create an
        // artificial delay to prevent accidential spamming
        setIsSendingPreview(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      setSaveErrorMessage(error.message);
    }
  };

  return (
    <Button
      data-cy="previewEmailButton"
      onClick={previewEmail}
      variant="outline"
      type="button"
      disabled={submitting || isSendingPreview}
      sx={{
        width: '100%',
        display: 'block',
      }}
    >
      Preview email
    </Button>
  );
};
