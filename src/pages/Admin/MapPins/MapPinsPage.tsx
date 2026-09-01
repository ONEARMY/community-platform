import { ChevronLeftIcon, ChevronRightIcon, ExternalLinkIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface AdminMapPinItem {
  id: number;
  name: string | null;
  country: string;
  countryCode?: string;
  administrative: string | null;
  postCode: string | null;
  moderation: string;
  profileId: number;
  profile?: {
    id: number;
    username: string | null;
    displayName: string;
  } | null;
}

export interface MapPinsPageProps {
  mapPins: AdminMapPinItem[];
  page: number;
  totalPages: number;
  totalCount: number;
}

function ModerationBadge({ status }: { status: string }) {
  const isAccepted = status === 'accepted';
  const isAwaiting = status === 'awaiting-moderation';
  const isNeedsImprovement = status === 'improvements-needed';
  const badgeClasses = isAccepted
    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
    : isAwaiting
      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
      : isNeedsImprovement
        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
        : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${badgeClasses}`}
    >
      {status}
    </span>
  );
}

export function MapPinsPage({ mapPins, page, totalPages, totalCount }: MapPinsPageProps) {
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Map Pins</h1>
        <span className="text-sm text-muted-foreground">Total: {totalCount}</span>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Profile</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Administrative Area</TableHead>
            <TableHead>Post Code</TableHead>
            <TableHead>Moderation Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mapPins.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No map pins found.
              </TableCell>
            </TableRow>
          ) : (
            mapPins.map((pin) => {
              const profileIdentifier = pin.profile?.username || pin.profileId;
              const profileDisplayName =
                pin.profile?.displayName || pin.profile?.username || `Profile #${pin.profileId}`;

              return (
                <TableRow key={pin.id}>
                  <TableCell className="font-medium">{pin.name || '-'}</TableCell>
                  <TableCell>
                    <Link
                      to={`/u/${profileIdentifier}`}
                      className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                    >
                      <span>{profileDisplayName}</span>
                      <ExternalLinkIcon className="size-3 text-muted-foreground" />
                    </Link>
                  </TableCell>
                  <TableCell>{pin.country || '-'}</TableCell>
                  <TableCell>{pin.administrative || '-'}</TableCell>
                  <TableCell>{pin.postCode || '-'}</TableCell>
                  <TableCell>
                    <ModerationBadge status={pin.moderation} />
                  </TableCell>
                </TableRow>
              );
            })
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
                render={<Link to={`/admin/map-pins?page=${page - 1}`} />}
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
                render={<Link to={`/admin/map-pins?page=${page + 1}`} />}
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
