import type { AdminComment, AdminCommentAuthor, DiscussionContentType } from 'oa-shared';
import { useState } from 'react';
import { Link } from 'react-router';
import { TablePagination } from 'src/pages/Admin/TablePagination';
import { formatUtcDate } from 'src/utils/helpers';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CommentDialog } from './CommentDialog';

const SOURCE_TYPE_LABELS: Record<DiscussionContentType, string> = {
  questions: 'Question',
  projects: 'Project',
  research_updates: 'Research update',
  news: 'News',
};

function CreatorCell({ author }: { author: AdminCommentAuthor | null }) {
  if (!author) {
    return <span className="text-muted-foreground">Unknown</span>;
  }

  if (!author.username) {
    return author.displayName;
  }

  return (
    <Link to={`/u/${author.username}`} className="inline-flex min-h-8 items-center hover:underline">
      {author.displayName}
    </Link>
  );
}

interface IProps {
  comments: AdminComment[];
  page: number;
  totalPages: number;
}

export function CommentsPage({ comments, page, totalPages }: IProps) {
  const [selected, setSelected] = useState<{ comment: AdminComment; editing: boolean } | null>(
    null,
  );
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Comments</h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Notifications</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} variant="muted" className="h-24 text-center">
                No comments yet.
              </TableCell>
            </TableRow>
          ) : (
            comments.map((comment) => (
              <TableRow key={comment.id} variant={comment.deleted ? 'muted' : 'default'}>
                <TableCell className="whitespace-nowrap">
                  {SOURCE_TYPE_LABELS[comment.sourceType]}
                  {comment.isReply && <span className="text-muted-foreground"> reply</span>}
                  {comment.deleted && ' (deleted)'}
                </TableCell>
                <TableCell>
                  {comment.liveUrl ? (
                    <Link
                      to={comment.liveUrl}
                      className="flex min-h-8 max-w-xs items-center hover:underline"
                      title={comment.comment}
                    >
                      <span className="truncate">{comment.comment}</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelected({ comment, editing: false })}
                      className="block min-h-8 max-w-xs cursor-pointer truncate text-left hover:underline"
                      title={comment.comment}
                      aria-label={`View full comment ${comment.id}`}
                    >
                      {comment.comment}
                    </button>
                  )}
                </TableCell>
                <TableCell>
                  <CreatorCell author={comment.author} />
                </TableCell>
                <TableCell variant="muted" className="whitespace-nowrap">
                  {formatUtcDate(comment.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <span className="tabular-nums">{comment.notificationCount}</span>
                </TableCell>
                <TableCell>
                  {!comment.deleted && comment.sourceId !== null && (
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`Edit comment ${comment.id}`}
                      onClick={() => setSelected({ comment, editing: true })}
                    >
                      Edit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <TablePagination page={page} totalPages={totalPages} />
      {selected && (
        <CommentDialog
          key={`${selected.comment.id}:${selected.editing}`}
          {...selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
