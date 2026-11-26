import type { ProfileTag } from 'oa-shared';
import { useState } from 'react';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const MAX_VISIBLE_TAGS = 4;

interface IProps {
  tags: ProfileTag[];
}

export const ProfileTags = ({ tags }: IProps) => {
  const [expanded, setExpanded] = useState(false);
  const visibleTags = expanded ? tags : tags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenCount = tags.length - visibleTags.length;

  return (
    <ul data-cy="ProfileTagsList" className="flex w-full flex-wrap justify-center gap-2">
      {visibleTags.map((tag) => (
        <li key={tag.id}>
          <Badge variant="outline">{tag.name}</Badge>
        </li>
      ))}
      {hiddenCount > 0 && (
        <li>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            aria-label={`Show ${hiddenCount} more tags`}
            className={cn(badgeVariants({ variant: 'outline' }), 'cursor-pointer hover:bg-muted')}
          >
            +{hiddenCount}
          </button>
        </li>
      )}
    </ul>
  );
};
