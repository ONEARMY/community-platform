import { LockIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { listing } from './labels';

interface IProps {
  src: string;
  className?: string;
}

export const NewsLockedImage = ({ src, className }: IProps) => (
  <div
    data-cy="news-locked-image"
    className={cn('relative aspect-hero w-full overflow-hidden', className)}
  >
    <img src={src} alt="" className="size-full scale-110 object-cover blur-xl" />
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="flex items-center gap-2 rounded-full bg-background px-4 py-2 font-heading text-sm text-foreground shadow-sm">
        <LockIcon className="size-4" />
        {listing.locked}
      </span>
    </div>
  </div>
);
