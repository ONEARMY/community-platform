import type { Image } from 'oa-shared';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import { useToast } from 'src/common/Toast/useToast';
import type { ImagePickerPath } from 'src/config/imagePickerPaths';
import { imagePickerService } from 'src/services/imagePickerService';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface IProps {
  open: boolean;
  path: ImagePickerPath;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}

export function ImagePickerDialog({ open, path, onOpenChange, onSelect }: IProps) {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  useEffect(() => {
    if (!open) {
      return;
    }

    setLoading(true);

    imagePickerService
      .list(path)
      .then(setImages)
      .catch(() => toast.error('Failed to load images'))
      .finally(() => setLoading(false));
  }, [open, path]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setUploading(true);

    const promise = imagePickerService.upload(path, file).finally(() => setUploading(false));

    toast.promise(promise, {
      loading: 'Uploading image...',
      success: (image) => {
        setImages((prev) => [image, ...prev]);
        onSelect(image.publicUrl);
        onOpenChange(false);
        return 'Image uploaded';
      },
      error: (error) => error.message || 'Error uploading image',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Choose an image</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload new image
          </Button>

          <div className="grid max-h-80 grid-cols-4 gap-2 overflow-auto">
            {loading && (
              <p className="col-span-4 py-6 text-center text-sm text-muted-foreground">
                Loading...
              </p>
            )}
            {!loading && images.length === 0 && (
              <p className="col-span-4 py-6 text-center text-sm text-muted-foreground">
                No images in this folder yet.
              </p>
            )}
            {images.map((image) => (
              <button
                key={image.id}
                type="button"
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-md"
                onClick={() => {
                  onSelect(image.publicUrl);
                  onOpenChange(false);
                }}
              >
                <img src={image.publicUrl} alt="" className="size-full object-cover" />
                <span className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-inset ring-transparent transition-colors group-hover:bg-black/30 group-hover:ring-primary" />
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
