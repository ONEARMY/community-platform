import type { AdminComment, DiscussionContentType } from 'oa-shared';
import { Link } from 'react-router';
import { AdminPagination } from 'src/pages/Admin/AdminPagination';
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {comments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} variant="muted" className="h-24 text-center">
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AdminPagination page={page} totalPages={totalPages} />
    </div>
  );
}
