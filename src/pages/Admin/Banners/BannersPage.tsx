import { TrashIcon } from 'lucide-react';
import type { Banner } from 'oa-shared';
import { type FormEvent, useEffect, useState } from 'react';
import { useRevalidator } from 'react-router';
import { useToast } from 'src/common/Toast/useToast';
import { bannerService } from 'src/pages/common/banner.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DeleteBannerDialog } from './DeleteBannerDialog';

interface IProps {
  banner: Banner | null;
}

const toForm = (banner: Banner | null) => ({ text: banner?.text ?? '', url: banner?.url ?? '' });

export function BannersPage({ banner }: IProps) {
  const [form, setForm] = useState(toForm(banner));
  const [textError, setTextError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const revalidator = useRevalidator();
  const toast = useToast();

  useEffect(() => {
    setForm(toForm(banner));
  }, [banner]);

  const isEditing = !!banner;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const text = form.text.trim();

    if (!text) {
      setTextError('Text is required');
      return;
    }

    setTextError(null);

    const data = { text, url: form.url.trim() || null };

    setSubmitting(true);

    const promise = (
      isEditing ? bannerService.updateBanner(banner.id, data) : bannerService.createBanner(data)
    ).finally(() => setSubmitting(false));

    toast.promise(promise, {
      loading: isEditing ? 'Saving banner...' : 'Creating banner...',
      success: () => {
        revalidator.revalidate();
        return isEditing ? 'Banner saved' : 'Banner created';
      },
      error: (error) => error.message || 'Something went wrong',
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Banner</h1>
        {isEditing && (
          <Button variant="outline" size="sm" onClick={() => setDeleting(true)}>
            <TrashIcon />
            Delete banner
          </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Shown at the top of every page for all visitors. Leave the URL empty for a plain message.
      </p>

      <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="banner-text">Text</Label>
          <Textarea
            id="banner-text"
            value={form.text}
            onChange={(event) => setForm((f) => ({ ...f, text: event.target.value }))}
            aria-invalid={!!textError}
            required
          />
          {textError && <p className="text-sm text-destructive">{textError}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="banner-url">URL</Label>
          <Input
            id="banner-url"
            type="url"
            placeholder="https://"
            value={form.url}
            onChange={(event) => setForm((f) => ({ ...f, url: event.target.value }))}
          />
        </div>

        <div>
          <Button type="submit" disabled={submitting}>
            {isEditing ? 'Save' : 'Create'}
          </Button>
        </div>
      </form>

      <DeleteBannerDialog
        banner={deleting ? banner : null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleting(false);
          }
        }}
      />
    </div>
  );
}
