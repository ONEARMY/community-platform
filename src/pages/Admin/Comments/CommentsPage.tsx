import { PencilIcon, TrashIcon } from 'lucide-react';
import type { AdminComment, DiscussionContentType } from 'oa-shared';
import { useState } from 'react';
import { Link, useRevalidator } from 'react-router';
import { useToast } from 'src/common/Toast/useToast';
import { AdminPagination } from 'src/pages/Admin/AdminPagination';
import { EditCommentDialog } from 'src/pages/common/CommentsSupabase/EditCommentDialog';
import { commentService } from 'src/services/commentService';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const CREATED_AT_FORMAT = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeZone: 'UTC',
});

const SOURCE_TYPE_LABELS: Record<DiscussionContentType, string> = {
  questions: 'Question',
  projects: 'Project',
  research_updates: 'Research update',
  news: 'News',
};

interface IProps {
  comments: AdminComment[];
  page: number;
  totalPages: number;
}

export function CommentsPage({ comments, page, totalPages }: IProps) {
  const [editing, setEditing] = useState<AdminComment | null>(null);
  const [deleting, setDeleting] = useState<AdminComment | null>(null);
  const revalidator = useRevalidator();
  const toast = useToast();

  const handleEdit = async (comment: AdminComment, text: string) => {
    const response = await commentService.editComment(comment.sourceId!, comment.id, text);
    if (response.ok) {
      revalidator.revalidate();
    }
    return response;
  };

  const handleDelete = (comment: AdminComment) => {
    setDeleting(null);

    const promise = commentService.deleteComment(comment.sourceId!, comment.id).then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText || 'Error deleting comment');
      }
    });

    toast.promise(promise, {
      loading: 'Deleting comment...',
      success: () => {
        revalidator.revalidate();
        return 'Comment deleted';
      },
      error: (error) => error.message || 'Something went wrong',
    });
  };

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
                <TableCell>
                  {SOURCE_TYPE_LABELS[comment.sourceType]}
                  {comment.isReply && ' (reply)'}
                </TableCell>
                <TableCell truncate className="max-w-xs" title={comment.comment}>
                  {comment.liveUrl ? (
                    <Link to={comment.liveUrl} className="hover:underline">
                      {comment.comment}
                    </Link>
                  ) : (
                    comment.comment
                  )}
                </TableCell>
                <TableCell>
                  {!comment.author ? (
                    <span className="text-muted-foreground">Creator unavailable</span>
                  ) : comment.author.username ? (
                    <Link to={`/u/${comment.author.username}`} className="hover:underline">
                      {comment.author.displayName}
                    </Link>
                  ) : (
                    comment.author.displayName
                  )}
                </TableCell>
                <TableCell variant="muted">{CREATED_AT_FORMAT.format(comment.createdAt)}</TableCell>
                <TableCell className="text-right">{comment.notificationCount}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={comment.deleted || !comment.sourceId}
                      aria-label={`Edit comment ${comment.id}`}
                      onClick={() => setEditing(comment)}
                    >
                      <PencilIcon />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={comment.deleted || !comment.sourceId}
                      aria-label={`Delete comment ${comment.id}`}
                      onClick={() => setDeleting(comment)}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AdminPagination page={page} totalPages={totalPages} />

      <EditCommentDialog
        isOpen={!!editing}
        comment={editing?.comment ?? ''}
        isReply={editing?.isReply}
        onClose={() => setEditing(null)}
        onSubmit={(text) => handleEdit(editing!, text)}
      />

      <ConfirmModal
        isOpen={!!deleting}
        message="Are you sure you want to delete this comment?"
        confirmButtonText="Delete"
        confirmVariant="destructive"
        handleCancel={() => setDeleting(null)}
        handleConfirm={() => handleDelete(deleting!)}
      />
    </div>
  );
}
