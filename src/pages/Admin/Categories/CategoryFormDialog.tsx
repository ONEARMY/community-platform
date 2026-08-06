import type { Category, ContentType } from 'oa-shared';
import { type FormEvent, useEffect, useState } from 'react';
import { useRevalidator } from 'react-router';
import { useToast } from 'src/common/Toast/useToast';
import { categoryService } from 'src/services/categoryService';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const CATEGORY_TYPE_OPTIONS: { value: ContentType; label: string }[] = [
  { value: 'questions', label: 'Questions' },
  { value: 'projects', label: 'Projects' },
  { value: 'research', label: 'Research' },
  { value: 'news', label: 'News' },
];

interface IProps {
  open: boolean;
  category: Category | null;
  onOpenChange: (open: boolean) => void;
}

const emptyForm = { name: '', type: null as ContentType | null, description: '', imageUrl: '' };

export function CategoryFormDialog({ open, category, onOpenChange }: IProps) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const revalidator = useRevalidator();
  const toast = useToast();

  useEffect(() => {
    if (open) {
      setForm(
        category
          ? {
              name: category.name,
              type: category.type,
              description: category.description ?? '',
              imageUrl: category.imageUrl ?? '',
            }
          : emptyForm,
      );
    }
  }, [open, category]);

  const isEditing = !!category;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!form.name.trim() || !form.type) {
      return;
    }

    const data = {
      name: form.name.trim(),
      type: form.type as ContentType,
      description: form.description.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
    };

    setSubmitting(true);

    const promise = (
      isEditing
        ? categoryService.updateCategory(category!.id, data)
        : categoryService.createCategory(data)
    ).finally(() => setSubmitting(false));

    toast.promise(promise, {
      loading: isEditing ? 'Saving category...' : 'Creating category...',
      success: () => {
        onOpenChange(false);
        revalidator.revalidate();
        return isEditing ? 'Category saved' : 'Category created';
      },
      error: (error) => error.message || 'Something went wrong',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit category' : 'New category'}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              value={form.name}
              onChange={(event) => setForm((f) => ({ ...f, name: event.target.value }))}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category-type">Type</Label>
            <Select
              items={CATEGORY_TYPE_OPTIONS}
              value={form.type}
              onValueChange={(value) => setForm((f) => ({ ...f, type: value as ContentType }))}
            >
              <SelectTrigger id="category-type" className="w-full">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category-description">Description</Label>
            <Textarea
              id="category-description"
              value={form.description}
              onChange={(event) => setForm((f) => ({ ...f, description: event.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category-image-url">Image URL</Label>
            <Input
              id="category-image-url"
              type="url"
              value={form.imageUrl}
              onChange={(event) => setForm((f) => ({ ...f, imageUrl: event.target.value }))}
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
