import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { Tag } from './tag';

type TagListProps = Omit<ComponentProps<'div'>, 'children'> & {
  tags: string[];
};

function TagList({ tags, className, ...props }: TagListProps) {
  return (
    <div
      data-slot="tag-list"
      data-cy="tag-list"
      className={cn('flex flex-wrap gap-1', className)}
      {...props}
    >
      {tags.filter(Boolean).map((tag) => (
        <Tag key={tag} label={tag} />
      ))}
    </div>
  );
}

export { TagList };
