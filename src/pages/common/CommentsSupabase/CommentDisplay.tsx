import { Username } from 'oa-components';
import type { Author, Comment } from 'oa-shared';
import { useContext } from 'react';
import AuthorBalloon from 'src/assets/images/author.svg';
import DefaultMemberImage from 'src/assets/images/default_member.svg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DisplayDate } from '@/components/ui/display-date';
import { cn } from '@/lib/utils';
import { AuthorsContext } from './AuthorsContext';
import { CommentBody } from './CommentBody';

interface IProps {
  comment: Comment;
  menuActions?: React.ReactNode;
  footerActions?: React.ReactNode;
}

export const CommentDisplay = ({ comment, menuActions, footerActions }: IProps) => {
  const { authors } = useContext(AuthorsContext);
  const highlight = comment.highlighted && 'border-2 border-dashed border-foreground';

  if (comment.deleted) {
    return (
      <div className={cn('mb-2 text-muted-foreground', highlight)} data-cy="deletedComment">
        [The original comment got deleted]
      </div>
    );
  }

  const isAuthor = !!comment.createdBy && authors.includes(comment.createdBy.id);
  const avatar = <CommentAvatar author={comment.createdBy} isAuthor={isAuthor} />;

  return (
    <div
      className={cn('flex grow gap-2', highlight)}
      data-cy={comment.highlighted ? 'highlighted-comment' : undefined}
    >
      <div className="hidden sm:block">{avatar}</div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="shrink-0 sm:hidden">{avatar}</div>
            {comment.createdBy && <Username user={comment.createdBy} />}
            <DisplayDate createdAt={comment.createdAt} showLabel={false} variant="muted" />
          </div>
          {menuActions && <div className="flex items-center gap-1">{menuActions}</div>}
        </div>

        <div className="flex flex-col">
          <CommentBody body={comment.comment} />
          {footerActions && (
            <div className="flex items-center justify-end gap-2">{footerActions}</div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentAvatar = ({ author, isAuthor }: { author: Author | null; isAuthor: boolean }) => (
  <div className="relative">
    {isAuthor && (
      <img
        src={AuthorBalloon}
        alt=""
        data-testid="author-balloon"
        className="pointer-events-none absolute z-1 -mt-7 -ml-2 w-17 max-w-none sm:ml-1"
      />
    )}
    <Avatar className="z-2 size-6 sm:size-10">
      {author?.photo && (
        <AvatarImage
          src={author.photo.publicUrl}
          alt={`Avatar of ${author.displayName || 'comment author'}`}
          loading="lazy"
        />
      )}
      <AvatarFallback>
        <img src={DefaultMemberImage} alt="" />
      </AvatarFallback>
    </Avatar>
  </div>
);
