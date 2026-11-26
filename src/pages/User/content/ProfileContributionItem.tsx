import type { Image as ImageType } from 'oa-shared';
import { Link } from 'react-router';
import { shortFormatNumber } from 'src/utils/helpers';
import DownloadIcon from '@/components/ui/icons/download.svg?react';
import EyeIcon from '@/components/ui/icons/eye.svg?react';
import StarActiveIcon from '@/components/ui/icons/star-active.svg?react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface IProps {
  type: 'library' | 'research' | 'questions';
  layout?: 'vertical' | 'horizontal';
  item: {
    id: string | number;
    coverImage?: ImageType;
    title: string;
    slug: string;
    usefulCount: number;
    totalViews: number;
    downloadCount?: number;
    hash?: string;
  };
}

export const ProfileContributionItem = ({ type, layout = 'vertical', item }: IProps) => {
  const { coverImage, slug, title, usefulCount, totalViews, downloadCount, hash } = item;
  const url = `/${type}/${encodeURIComponent(slug)}?utm_source=user-profile${hash ? `#${hash}` : ''}`;
  const isHorizontal = layout === 'horizontal';
  const stats = [
    { label: 'Useful count', value: usefulCount, Icon: StarActiveIcon },
    { label: 'Views', value: totalViews, Icon: EyeIcon },
    ...(downloadCount === undefined
      ? []
      : [{ label: 'Downloads', value: downloadCount, Icon: DownloadIcon }]),
  ];

  return (
    <Link
      to={url}
      data-testid={`${type}-link`}
      data-cy={`${slug}-link`}
      className={cn(
        'flex gap-2.5 rounded-lg bg-muted p-2.5 transition-colors hover:bg-border',
        isHorizontal ? 'items-center' : 'w-58 shrink-0 snap-start flex-col sm:w-auto',
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
            isHorizontal ? 'size-15' : 'aspect-5/3 w-full',
          )}
        />
      ) : (
        !isHorizontal && <div className="aspect-5/3 w-full rounded-md bg-border" />
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="m-0 line-clamp-2 text-base text-foreground">{title}</p>
        <div className="mt-auto flex gap-3 text-sm text-muted-foreground">
          {stats.map(({ label, value, Icon }) => (
            <Tooltip key={label}>
              <TooltipTrigger
                render={<span tabIndex={0} />}
                aria-label={`${label}: ${value}`}
                className="inline-flex items-center gap-1"
              >
                {shortFormatNumber(value)}
                <Icon className="size-5" />
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </Link>
  );
};
