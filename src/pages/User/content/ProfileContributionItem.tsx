import type { Image as ImageType } from 'oa-shared';
import { Link } from 'react-router';
import { shortFormatNumber } from 'src/utils/helpers';
import CommentIcon from '@/components/ui/icons/comment.svg?react';
import StarActiveIcon from '@/components/ui/icons/star-active.svg?react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface IProps {
  type: 'library' | 'research' | 'questions';
  layout?: 'vertical' | 'horizontal';
  item: {
    id: string | number;
    commentCount?: number;
    coverImage?: ImageType;
    title: string;
    slug: string;
    usefulCount: number;
  };
}

export const ProfileContributionItem = ({ type, layout = 'vertical', item }: IProps) => {
  const { commentCount, coverImage, slug, title, usefulCount } = item;
  const url = `/${type}/${encodeURIComponent(slug)}?utm_source=user-profile`;
  const isHorizontal = layout === 'horizontal';

  return (
    <Link
      to={url}
      data-testid={`${type}-link`}
      data-cy={`${slug}-link`}
      className={cn(
        'flex gap-2.5 rounded-lg border border-border bg-muted p-2.5 transition-colors hover:border-input',
        isHorizontal ? 'items-center' : 'flex-col',
      )}
    >
      {coverImage?.publicUrl ? (
        <img
          data-cy={`UserDocumentItem: coverImage for ${title}`}
          loading="lazy"
          src={coverImage.publicUrl}
          crossOrigin=""
          alt={`Cover image for ${title}`}
          className={cn(
            'shrink-0 rounded-md object-cover',
            isHorizontal ? 'size-15' : 'aspect-8/3 w-full sm:aspect-5/3',
          )}
        />
      ) : (
        !isHorizontal && <div className="aspect-8/3 w-full rounded-md bg-border sm:aspect-5/3" />
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="m-0 line-clamp-2 text-sm text-foreground">{title}</p>
        <div className="mt-auto flex gap-3 text-xs text-foreground">
          <Tooltip>
            <TooltipTrigger
              render={<span tabIndex={0} />}
              aria-label={`Useful count: ${usefulCount}`}
              className="inline-flex items-center gap-1"
            >
              {shortFormatNumber(usefulCount)}
              <StarActiveIcon className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Useful count</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={<span tabIndex={0} />}
              aria-label={`Comment count: ${commentCount || 0}`}
              className="inline-flex items-center gap-1"
            >
              {shortFormatNumber(commentCount || 0)}
              <CommentIcon className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Comment count</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </Link>
  );
};
