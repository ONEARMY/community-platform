import type { Category } from 'oa-shared';
import { useState } from 'react';
import { useRevalidator } from 'react-router';
import { useToast } from 'src/common/Toast/useToast';
import { categoryService } from 'src/services/categoryService';
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
  category: Category | null;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCategoryDialog({ category, onOpenChange }: IProps) {
  const [submitting, setSubmitting] = useState(false);
  const revalidator = useRevalidator();
  const toast = useToast();

  const handleDelete = () => {
    if (!category) {
      return;
    }

    setSubmitting(true);

    const promise = categoryService.deleteCategory(category.id).finally(() => setSubmitting(false));

    toast.promise(promise, {
      loading: 'Deleting category...',
      success: () => {
        onOpenChange(false);
        revalidator.revalidate();
        return 'Category deleted';
      },
      error: (error) => error.message || 'Something went wrong',
    });
  };

  return (
    <Dialog open={!!category} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{category?.name}"? This cannot be undone.
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
