import { Username } from 'oa-components';
import type { Author } from 'oa-shared';
import { cn } from '@/lib/utils';

export interface ArticleCallToActionProps {
  author: Author;
  children: React.ReactNode;
  contributors?: Author[];
  className?: string;
}

export function ArticleCallToAction({
  author,
  children,
  contributors,
  className,
}: ArticleCallToActionProps) {
  return (
    <div data-slot="article-call-to-action" className={cn('flex flex-col items-center', className)}>
      <div className="flex items-center">
        <span className="text-sm">Made by</span>
        <Username user={author} sx={{ ml: 1 }} />
      </div>

      {contributors && contributors.length ? (
        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1 text-center text-sm text-muted-foreground">
          With contributions from:{' '}
          {contributors.map((contributor, key) => (
            <Username key={key} user={contributor} />
          ))}
        </div>
      ) : null}

      <h2 className="my-5 font-heading text-3xl font-normal">Like what you see? 👇</h2>

      <div className="flex flex-col gap-2.5 sm:flex-row">{children}</div>
    </div>
  );
}
