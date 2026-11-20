import type { AdminNews } from 'oa-shared';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const PUBLISHED_AT_FORMAT = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeZone: 'UTC',
});

interface IProps {
  news: AdminNews[];
}

function ModerationBadge({ status }: { status: string | null }) {
  if (!status) {
    return <span className="text-muted-foreground">—</span>;
  }
  const variant =
    status === 'accepted'
      ? 'success'
      : status === 'awaiting-moderation'
        ? 'warning'
        : status === 'improvements-needed'
          ? 'info'
          : 'destructive';
  return <Badge variant={variant}>{status}</Badge>;
}

export function NewsPage({ news }: IProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">News</h1>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Moderation</TableHead>
            <TableHead>Draft</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Comments</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Poll</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {news.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} variant="muted" className="h-24 text-center">
                No news yet.
              </TableCell>
            </TableRow>
          ) : (
            news.map((item) => (
              <TableRow key={item.id} variant={item.deleted ? 'muted' : 'default'}>
                <TableCell>
                  <Link to={`/news/${item.slug}`} className="font-medium hover:underline">
                    {item.title}
                  </Link>
                </TableCell>
                <TableCell>
                  {!item.authorDisplayName && !item.authorUserName ? (
                    <span className="text-muted-foreground">—</span>
                  ) : item.authorUserName ? (
                    <Link to={`/u/${item.authorUserName}`} className="hover:underline">
                      {item.authorDisplayName || item.authorUserName}
                    </Link>
                  ) : (
                    item.authorDisplayName
                  )}
                </TableCell>
                <TableCell>
                  {item.category?.name || <span className="text-muted-foreground">—</span>}
                </TableCell>
                <TableCell variant="muted" truncate className="max-w-xs">
                  {item.tags.length > 0 ? (
                    item.tags.join(', ')
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <ModerationBadge status={item.moderation} />
                </TableCell>
                <TableCell>{item.isDraft ? 'Yes' : 'No'}</TableCell>
                <TableCell variant="muted">
                  {item.publishedAt ? (
                    PUBLISHED_AT_FORMAT.format(item.publishedAt)
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>{item.commentCount}</TableCell>
                <TableCell>{item.totalViews}</TableCell>
                <TableCell>{item.hasPoll ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
