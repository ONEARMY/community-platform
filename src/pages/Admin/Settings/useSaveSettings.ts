import { useState } from 'react';
import { useRevalidator } from 'react-router';
import { useToast } from 'src/common/Toast/useToast';
import {
  type AdminSettingsFormData,
  adminSettingsService,
} from 'src/services/adminSettingsService';

export const useSaveSettings = () => {
  const [submitting, setSubmitting] = useState(false);
  const revalidator = useRevalidator();
  const toast = useToast();

  const save = (form: AdminSettingsFormData) => {
    setSubmitting(true);

    const promise = adminSettingsService.update(form).finally(() => setSubmitting(false));

    toast.promise(promise, {
      loading: 'Saving settings...',
      success: () => {
        revalidator.revalidate();
        return 'Settings saved';
      },
      error: (error) => error.message || 'Something went wrong',
    });
  };

  return { save, submitting };
};
