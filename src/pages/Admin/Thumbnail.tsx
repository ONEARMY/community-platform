import { ImageOffIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface IProps {
  imageUrl: string | null;
  alt: string;
  className?: string;
}

export function Thumbnail({ imageUrl, alt, className }: IProps) {
  const [failed, setFailed] = useState(false);

  if (!imageUrl || failed) {
    return (
      <div
        role="img"
        aria-label="No image"
        className="flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground"
      >
        <ImageOffIcon className="size-4" />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      loading="lazy"
      className={cn('size-10 max-w-none rounded-md object-contain', className)}
      onError={() => setFailed(true)}
    />
  );
}
