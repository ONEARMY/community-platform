import type { Tag } from 'oa-shared';
import { type FormEvent, useEffect, useState } from 'react';
import { useRevalidator } from 'react-router';
import { useToast } from 'src/common/Toast/useToast';
import { tagsService } from 'src/services/tagsService';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface IProps {
  open: boolean;
  tag: Tag | null;
  onOpenChange: (open: boolean) => void;
}

const emptyForm = { name: '' };

export function TagFormDialog({ open, tag, onOpenChange }: IProps) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const revalidator = useRevalidator();
  const toast = useToast();

  useEffect(() => {
    if (open) {
      setForm(tag ? { name: tag.name } : emptyForm);
    }
  }, [open, tag]);

  const isEditing = !!tag;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const name = form.name.trim();

    if (!name) {
      return;
    }

    setSubmitting(true);

    const promise = (
      isEditing ? tagsService.updateTag(tag!.id, { name }) : tagsService.createTag({ name })
    ).finally(() => setSubmitting(false));

    toast.promise(promise, {
      loading: isEditing ? 'Saving tag...' : 'Creating tag...',
      success: () => {
        onOpenChange(false);
        revalidator.revalidate();
        return isEditing ? 'Tag saved' : 'Tag created';
      },
      error: (error) => error.message || 'Something went wrong',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit tag' : 'New tag'}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Label htmlFor="tag-name">Name</Label>
            <Input
              id="tag-name"
              value={form.name}
              onChange={(event) => setForm({ name: event.target.value })}
              required
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {isEditing ? 'Save' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
