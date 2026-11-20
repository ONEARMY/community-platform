import { ChevronLeftIcon, ChevronRightIcon, UsersIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeZone: 'UTC',
});

const STATUS_LABELS: Record<string, string> = {
  'in-progress': 'In progress',
  complete: 'Complete',
  archived: 'Archived',
};

export interface AdminResearchItem {
  id: number;
  title: string;
  slug: string;
  status: string | null;
  isDraft: boolean;
  deleted: boolean;
  publishedAt: string | null;
  createdAt: string;
  totalViews: number;
  totalUseful: number;
  updateCount: number;
  collaboratorCount: number;
  category: string | null;
  author: { username: string | null; displayName: string } | null;
}

export interface ResearchPageProps {
  research: AdminResearchItem[];
  page: number;
  totalPages: number;
  totalCount: number;
}

function StatusBadge({ status }: { status: string | null }) {
  if (!status) {
    return <span className="text-muted-foreground">-</span>;
  }

  const variant = status === 'complete' ? 'success' : status === 'in-progress' ? 'info' : 'default';

  return <Badge variant={variant}>{STATUS_LABELS[status] ?? status}</Badge>;
}

function PublicationBadge({ item }: { item: AdminResearchItem }) {
  if (item.deleted) {
    return <Badge variant="destructive">Deleted</Badge>;
  }

  return item.isDraft ? (
    <Badge variant="warning">Draft</Badge>
  ) : (
    <Badge variant="success">Published</Badge>
  );
}

export function ResearchPage({ research, page, totalPages, totalCount }: ResearchPageProps) {
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Research</h1>
        <span className="text-sm text-muted-foreground">Total: {totalCount}</span>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Useful</TableHead>
            <TableHead>Updates</TableHead>
            <TableHead>Collaborators</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {research.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} variant="muted" className="h-24 text-center">
                No research found.
              </TableCell>
            </TableRow>
          ) : (
            research.map((item) => (
              <TableRow key={item.id} variant={item.deleted ? 'muted' : 'default'}>
                <TableCell variant="strong">
                  <Link to={`/research/${item.slug}`} className="hover:underline">
                    {item.title}
                  </Link>
                </TableCell>
                <TableCell>
                  {!item.author ? (
                    <span className="text-muted-foreground">-</span>
                  ) : item.author.username ? (
                    <Link to={`/u/${item.author.username}`} className="hover:underline">
                      {item.author.displayName}
                    </Link>
                  ) : (
                    item.author.displayName
                  )}
                </TableCell>
                <TableCell>{item.category || '-'}</TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell>
                  <PublicationBadge item={item} />
                </TableCell>
                <TableCell>{item.totalViews}</TableCell>
                <TableCell>{item.totalUseful}</TableCell>
                <TableCell>{item.updateCount}</TableCell>
                <TableCell>
                  {item.collaboratorCount > 0 ? (
                    <span
                      className="inline-flex items-center gap-1"
                      title={`${item.collaboratorCount} collaborators`}
                    >
                      <UsersIcon className="size-3.5 text-muted-foreground" />
                      {item.collaboratorCount}
                    </span>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell variant="muted">
                  {DATE_FORMAT.format(new Date(item.publishedAt || item.createdAt))}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            {hasPrevious ? (
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<Link to={`/admin/research?page=${page - 1}`} />}
              >
                <ChevronLeftIcon className="size-4 mr-1" />
                Previous
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                <ChevronLeftIcon className="size-4 mr-1" />
                Previous
              </Button>
            )}
            {hasNext ? (
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<Link to={`/admin/research?page=${page + 1}`} />}
              >
                Next
                <ChevronRightIcon className="size-4 ml-1" />
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Next
                <ChevronRightIcon className="size-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
