import { LockIcon } from 'lucide-react';
import type { News } from 'oa-shared';
import { cn } from '@/lib/utils';
import { listing } from './labels';

interface IProps {
  news: News;
  className?: string;
}

export const NewsLockedImage = ({ news, className }: IProps) => {
  const badge = news.profileBadges?.find((x) => x.id === news.ctaBadgeId);

  return (
    <div
      data-cy="news-locked-image"
      className={cn('relative aspect-hero w-full overflow-hidden', className)}
    >
      <img
        src={news.heroImage?.publicUrl}
        alt=""
        className="size-full scale-110 object-cover blur-xl"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex items-center gap-2 rounded-full bg-background px-4 py-2 font-heading text-sm text-foreground shadow-sm">
          <LockIcon className="size-4" />
          {badge ? (
            <>
              Just for <img src={badge.imageUrl} alt="" className="size-5 object-contain" />
              {badge.displayName}
            </>
          ) : (
            listing.locked
          )}
        </span>
      </div>
    </div>
  );
};
