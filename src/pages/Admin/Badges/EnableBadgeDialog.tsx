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

export function EnableBadgeDialog({ profileBadge, onOpenChange }: IProps) {
  const [submitting, setSubmitting] = useState(false);
  const revalidator = useRevalidator();
  const toast = useToast();

  const handleEnable = () => {
    if (!profileBadge) {
      return;
    }

    setSubmitting(true);

    const promise = ProfileBadgeService.deleteProfileBadge(profileBadge.badge.id).finally(() =>
      setSubmitting(false),
    );

    toast.promise(promise, {
      loading: 'Enabling badge badge...',
      success: () => {
        onOpenChange(false);
        revalidator.revalidate();
        return 'Badge enabled';
      },
      error: (error) => error.message || 'Something went wrong',
    });
  };

  return (
    <Dialog open={!!profileBadge} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enable Badge</DialogTitle>
          <DialogDescription>
            Are you sure you want to enable "{profileBadge?.badge.displayName}"?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleEnable} disabled={submitting}>
            Enable
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
