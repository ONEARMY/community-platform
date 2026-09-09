import type { Banner } from 'oa-shared';
import { useState } from 'react';
import { useRevalidator } from 'react-router';
import { useToast } from 'src/common/Toast/useToast';
import { bannerService } from 'src/pages/common/banner.service';
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
  banner: Banner | null;
  onOpenChange: (open: boolean) => void;
}

export function DeleteBannerDialog({ banner, onOpenChange }: IProps) {
  const [submitting, setSubmitting] = useState(false);
  const revalidator = useRevalidator();
  const toast = useToast();

  const handleDelete = () => {
    if (!banner) {
      return;
    }

    setSubmitting(true);

    const promise = bannerService.deleteBanner(banner.id).finally(() => setSubmitting(false));

    toast.promise(promise, {
      loading: 'Deleting banner...',
      success: () => {
        onOpenChange(false);
        revalidator.revalidate();
        return 'Banner deleted';
      },
      error: (error) => error.message || 'Something went wrong',
    });
  };

  return (
    <Dialog open={!!banner} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete banner</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the banner? It will no longer be shown on the site.
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
