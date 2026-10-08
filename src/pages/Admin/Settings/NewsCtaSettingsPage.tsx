import { ImageOffIcon, XIcon } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { ImagePickerDialog } from 'src/pages/common/ImagePicker/ImagePickerDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSaveSettings } from './useSaveSettings';

interface IProps {
  newsCtaTitle: string | null;
  newsCtaBody: string | null;
  newsCtaImageUrl: string | null;
}

export function NewsCtaSettingsPage(props: IProps) {
  const [form, setForm] = useState({
    newsCtaTitle: props.newsCtaTitle ?? '',
    newsCtaBody: props.newsCtaBody ?? '',
    newsCtaImageUrl: props.newsCtaImageUrl ?? '',
  });
  const [pickerOpen, setPickerOpen] = useState(false);
  const { save, submitting } = useSaveSettings();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    save(form);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">News CTA</h1>

      <p className="text-sm text-muted-foreground">
        Shown at the bottom of a members-only news preview, above the badge's action button.
      </p>

      <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="settings-news-cta-image">Image</Label>
          <div className="flex items-center gap-3">
            {form.newsCtaImageUrl ? (
              <img
                src={form.newsCtaImageUrl}
                alt=""
                className="size-10 rounded-md object-contain"
              />
            ) : (
              <div className="flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <ImageOffIcon className="size-5" />
              </div>
            )}
            <Button
              id="settings-news-cta-image"
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPickerOpen(true)}
            >
              Choose image
            </Button>
            {form.newsCtaImageUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setForm((f) => ({ ...f, newsCtaImageUrl: '' }))}
              >
                <XIcon />
                Remove
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="settings-news-cta-title">Title</Label>
          <Input
            id="settings-news-cta-title"
            value={form.newsCtaTitle}
            onChange={(event) => setForm((f) => ({ ...f, newsCtaTitle: event.target.value }))}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="settings-news-cta-body">Body</Label>
          <Textarea
            id="settings-news-cta-body"
            value={form.newsCtaBody}
            onChange={(event) => setForm((f) => ({ ...f, newsCtaBody: event.target.value }))}
          />
        </div>

        <div>
          <Button type="submit" disabled={submitting}>
            Save
          </Button>
        </div>
      </form>

      <ImagePickerDialog
        open={pickerOpen}
        path="settings"
        onOpenChange={setPickerOpen}
        onSelect={(url) => setForm((f) => ({ ...f, newsCtaImageUrl: url }))}
      />
    </div>
  );
}
