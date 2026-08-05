import type { Comment } from 'oa-shared';
import { useMemo } from 'react';
import { Heading } from 'theme-ui';

export const NO_COMMENTS = 'Start the discussion';
export const COMMENTS = 'Comments';

export interface IProps {
  comments: Comment[];
  noun?: string;
}

export const CommentsTitle = ({ comments, noun = COMMENTS }: IProps) => {
  const title = useMemo(() => {
    const commentCount =
      comments.filter((x) => !x.deleted).length +
      comments.flatMap((x) => x.replies).filter((x) => !!x).length;

    if (commentCount === 0) {
      return NO_COMMENTS;
    }

    return `${commentCount} ${noun}`;
  }, [comments, noun]);

  return (
    <Heading as="h3" variant="h3" data-cy="DiscussionTitle" sx={{ whiteSpace: 'nowrap' }}>
      {title}
    </Heading>
  );
};
