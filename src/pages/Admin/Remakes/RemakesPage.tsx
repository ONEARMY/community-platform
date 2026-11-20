import type { AdminRemake } from 'oa-shared';
import { Link } from 'react-router';
import { Thumbnail } from 'src/pages/Admin/Thumbnail';
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

interface IProps {
  remakes: AdminRemake[];
}

export function RemakesPage({ remakes }: IProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Remakes</h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">Image</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {remakes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} variant="muted" className="h-24 text-center">
                No remakes yet.
              </TableCell>
            </TableRow>
          ) : (
            remakes.map((remake) => (
              <TableRow key={remake.id}>
                <TableCell>
                  <Thumbnail
                    imageUrl={remake.imageUrl}
                    alt={remake.author ? `Remake by ${remake.author.displayName}` : 'Remake'}
                    className="object-cover"
                  />
                </TableCell>
                <TableCell>
                  {!remake.project ? (
                    <span className="text-muted-foreground">Project unavailable</span>
                  ) : remake.project.deleted ? (
                    <span className="text-muted-foreground">
                      {remake.project.title} (marked for deletion)
                    </span>
                  ) : (
                    <Link
                      to={`/library/${remake.project.slug}#remakes`}
                      className="font-medium hover:underline"
                    >
                      {remake.project.title}
                    </Link>
                  )}
                </TableCell>
                <TableCell>
                  {!remake.author ? (
                    <span className="text-muted-foreground">Creator unavailable</span>
                  ) : remake.author.username ? (
                    <Link to={`/u/${remake.author.username}`} className="hover:underline">
                      {remake.author.displayName}
                    </Link>
                  ) : (
                    remake.author.displayName
                  )}
                </TableCell>
                <TableCell
                  variant="muted"
                  truncate
                  className="max-w-xs"
                  title={remake.description ?? undefined}
                >
                  {remake.description}
                </TableCell>
                <TableCell variant="muted">{CREATED_AT_FORMAT.format(remake.createdAt)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
