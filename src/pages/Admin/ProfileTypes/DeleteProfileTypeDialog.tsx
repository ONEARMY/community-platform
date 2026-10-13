import type { ProfileType } from 'oa-shared';
import { useState } from 'react';
import { useRevalidator } from 'react-router';
import { useToast } from 'src/common/Toast/useToast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { profileTypesService } from '@/services/profileTypesService';

interface IProps {
  profileType: ProfileType | null;
  onOpenChange: (open: boolean) => void;
}

export function DeleteProfileTypeDialog({ profileType, onOpenChange }: IProps) {
  const [submitting, setSubmitting] = useState(false);
  const revalidator = useRevalidator();
  const toast = useToast();

  const handleDelete = () => {
    if (!profileType) {
      return;
    }

    setSubmitting(true);

    const promise = profileTypesService
      .deleteProfileType(profileType.id)
      .finally(() => setSubmitting(false));

    toast.promise(promise, {
      loading: 'Deleting profile type...',
      success: () => {
        onOpenChange(false);
        revalidator.revalidate();
        return 'Profile type deleted';
      },
      error: (error) => error.message || 'Something went wrong',
    });
  };

  return (
    <Dialog open={!!profileType} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Profile Type</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{profileType?.name}"? This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
