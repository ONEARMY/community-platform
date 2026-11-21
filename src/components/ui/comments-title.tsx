import type { Comment } from 'oa-shared';
import { useMemo } from 'react';

export const NO_COMMENTS = 'Start the discussion';
export const COMMENTS = 'Comments';

interface IProps {
  comments: Comment[];
  noun?: string;
}

export function CommentsTitle({ comments, noun = COMMENTS }: IProps) {
  const title = useMemo(() => {
    const commentCount =
      comments.filter((x) => !x.deleted).length +
      comments.flatMap((x) => x.replies).filter((x) => !!x).length;

    if (commentCount === 0) {
      return NO_COMMENTS;
    }

    const label = commentCount === 1 && noun.endsWith('s') ? noun.slice(0, -1) : noun;

    return `${commentCount} ${label}`;
  }, [comments, noun]);

  return (
    <h3
      className="m-0 font-heading text-lg font-normal whitespace-nowrap"
      data-cy="DiscussionTitle"
    >
      {title}
    </h3>
  );
}
