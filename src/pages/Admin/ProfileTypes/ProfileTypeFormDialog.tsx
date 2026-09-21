import { ImageOffIcon } from 'lucide-react';
import type { ProfileType } from 'oa-shared';
import { type FormEvent, useEffect, useState } from 'react';
import { useRevalidator } from 'react-router';
import { useToast } from 'src/common/Toast/useToast';
import { ImagePickerDialog } from 'src/pages/common/ImagePicker/ImagePickerDialog';
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
import { Textarea } from '@/components/ui/textarea';
import { profileTypesService } from '@/services/profileTypesService';

interface IProps {
  open: boolean;
  profileType: ProfileType | null;
  onOpenChange: (open: boolean) => void;
}

const emptyForm = { name: '', description: '', imageUrl: '' };

export function ProfileTypeFormDialog({ open, profileType, onOpenChange }: IProps) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const revalidator = useRevalidator();
  const toast = useToast();

  useEffect(() => {
    if (open) {
      setForm(
        profileType
          ? {
              name: profileType.name ?? '',
              description: profileType.description ?? '',
              imageUrl: profileType.imageUrl ?? '',
            }
          : emptyForm,
      );
    }
  }, [open, profileType]);

  const isEditing = !!profileType;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!form.name.trim()) {
      return;
    }

    const data = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
    };

    setSubmitting(true);

    const promise = (
      isEditing
        ? profileTypesService.updateProfileType(profileType!.id, data)
        : profileTypesService.createProfileType(data)
    ).finally(() => setSubmitting(false));

    toast.promise(promise, {
      loading: isEditing ? 'Saving profile type...' : 'Creating profile type...',
      success: () => {
        onOpenChange(false);
        revalidator.revalidate();
        return isEditing ? 'Profile type saved' : 'Profile type created';
      },
      error: (error) => error.message || 'Something went wrong',
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit profile type' : 'New profile type'}</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-2">
              <Label htmlFor="profile-type-name">Name</Label>
              <Input
                id="profile-type-name"
                value={form.name}
                onChange={(event) => setForm((f) => ({ ...f, name: event.target.value }))}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="profile-type-description">Description</Label>
              <Textarea
                id="profile-type-description"
                value={form.description}
                onChange={(event) => setForm((f) => ({ ...f, description: event.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Image</Label>
              <div className="flex items-center gap-3">
                {form.imageUrl ? (
                  <img src={form.imageUrl} alt="" className="size-16 rounded-md object-contain" />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <ImageOffIcon className="size-5" />
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPickerOpen(true)}
                  >
                    Choose image
                  </Button>
                  {form.imageUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setForm((f) => ({ ...f, imageUrl: '' }))}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={submitting}>
                {isEditing ? 'Save' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ImagePickerDialog
        open={pickerOpen}
        path="categories"
        onOpenChange={setPickerOpen}
        onSelect={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
      />
    </>
  );
}
