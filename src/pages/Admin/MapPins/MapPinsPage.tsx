import { ChevronLeftIcon, ChevronRightIcon, ExternalLinkIcon } from 'lucide-react';
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
    profileType?: {
      id: number;
      name: string;
      displayName: string;
      imageUrl?: string | null;
    } | null;
  } | null;
}

export interface MapPinsPageProps {
  mapPins: AdminMapPinItem[];
  page: number;
  totalPages: number;
  totalCount: number;
}

function ModerationBadge({ status }: { status: string }) {
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
            <TableHead>Profile Type</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Administrative Area</TableHead>
            <TableHead>Post Code</TableHead>
            <TableHead>Moderation Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mapPins.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} variant="muted" className="h-24 text-center">
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
                  <TableCell variant="strong">{pin.name || '-'}</TableCell>
                  <TableCell>
                    <Link
                      to={`/u/${profileIdentifier}`}
                      className="inline-flex items-center gap-1 text-outline hover:underline font-medium"
                    >
                      <span>{profileDisplayName}</span>
                      <ExternalLinkIcon className="size-3 text-muted-foreground" />
                    </Link>
                  </TableCell>
                  <TableCell>
                    {pin.profile?.profileType ? (
                      <div className="flex items-center gap-2">
                        {pin.profile.profileType.imageUrl && (
                          <img
                            src={pin.profile.profileType.imageUrl}
                            alt={pin.profile.profileType.displayName}
                            className="size-5 rounded-full object-contain"
                          />
                        )}
                        <span>{pin.profile.profileType.displayName}</span>
                      </div>
                    ) : (
                      '-'
                    )}
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
