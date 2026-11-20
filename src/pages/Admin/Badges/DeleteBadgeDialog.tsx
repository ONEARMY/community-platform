import { useState } from 'react';
import { useRevalidator } from 'react-router';
import { useToast } from 'src/common/Toast/useToast';
import { ProfileBadgeService } from 'src/services/profileBadgeService';
import type { AdminProfileBadge } from 'src/utils/profileBadges';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface IProps {
  profileBadge: AdminProfileBadge | null;
  onOpenChange: (open: boolean) => void;
}

export function DeleteBadgeDialog({ profileBadge, onOpenChange }: IProps) {
  const [submitting, setSubmitting] = useState(false);
  const revalidator = useRevalidator();
  const toast = useToast();

  const handleDelete = () => {
    if (!profileBadge) {
      return;
    }

    setSubmitting(true);

    const promise = ProfileBadgeService.deleteProfileBadge(profileBadge.badge.id).finally(() =>
      setSubmitting(false),
    );

    toast.promise(promise, {
      loading: 'Deleting badge...',
      success: () => {
        onOpenChange(false);
        revalidator.revalidate();
        return 'Badge deleted';
      },
      error: (error) => error.message || 'Something went wrong',
    });
  };

  return (
    <Dialog open={!!profileBadge} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Badge</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{profileBadge?.badge.displayName}"? This cannot be
            undone.
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
