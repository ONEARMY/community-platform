import type { Comment } from 'oa-shared';
import { useMemo } from 'react';
import { Heading } from 'theme-ui';

export const NO_COMMENTS = 'Start the discussion';
export const ONE_COMMENT = '1 Comment';
export const COMMENTS = 'Comments';

export interface IProps {
  comments: Comment[];
}

export const CommentsTitle = ({ comments }: IProps) => {
  const title = useMemo(() => {
    const commentCount =
      comments.filter((x) => !x.deleted).length +
      comments.flatMap((x) => x.replies).filter((x) => !!x).length;

    if (commentCount === 0) {
      return NO_COMMENTS;
    }
    if (commentCount === 1) {
      return ONE_COMMENT;
    }

    return `${commentCount} ${COMMENTS}`;
  }, [comments]);

  return (
    <Heading as="h3" data-cy="DiscussionTitle" sx={{ whiteSpace: 'nowrap' }}>
      {title}
    </Heading>
  );
};
