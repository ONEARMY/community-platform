import { ModerationRecord } from 'oa-components';
import type { AdminOrganisation, Moderation } from 'oa-shared';
import { type FormEvent, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { AdminPagination } from 'src/pages/Admin/AdminPagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ModerateOrganisationDialog } from './ModerateOrganisationDialog';
import { MODERATIONS } from './moderation';

export type OrganisationStatusFilter = Moderation | 'all';

export const STATUS_FILTERS: OrganisationStatusFilter[] = [...MODERATIONS, 'all'];

const STATUS_FILTER_OPTIONS = STATUS_FILTERS.map((value) => ({
  value,
  label: value === 'all' ? 'All' : ModerationRecord[value],
}));

const BADGE_VARIANTS = {
  'awaiting-moderation': 'warning',
  'improvements-needed': 'info',
  rejected: 'destructive',
  accepted: 'success',
} as const;

const CREATED_AT_FORMAT = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeZone: 'UTC',
});

interface IProps {
  organisations: AdminOrganisation[];
  status: OrganisationStatusFilter;
  search: string | null;
  page: number;
  totalPages: number;
}

export function OrganisationsPage({ organisations, status, search, page, totalPages }: IProps) {
  const [moderating, setModerating] = useState<AdminOrganisation | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const q = String(new FormData(event.currentTarget).get('q') ?? '').trim();
    setSearchParams({ ...(searchParams.has('status') && { status }), ...(q && { q }) });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-lg font-semibold">Organisations</h1>
        <div className="flex flex-wrap items-center gap-2">
          <form role="search" onSubmit={handleSearch}>
            <Input
              key={search}
              name="q"
              type="search"
              defaultValue={search ?? ''}
              placeholder="Search name or username"
              aria-label="Search organisations"
              className="w-56"
            />
          </form>
          <Label htmlFor="organisation-status">Status</Label>
          <Select
            items={STATUS_FILTER_OPTIONS}
            value={status}
            onValueChange={(value) =>
              setSearchParams({ status: value as string, ...(search && { q: search }) })
            }
          >
            <SelectTrigger id="organisation-status" className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Organisation</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>About</TableHead>
            <TableHead>Feedback</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Profile ID</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organisations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} variant="muted" className="h-24 text-center">
                No organisations found.
              </TableCell>
            </TableRow>
          ) : (
            organisations.map((organisation) => (
              <TableRow key={organisation.id}>
                <TableCell>
                  <div className="flex flex-col">
                    {organisation.username ? (
                      <Link
                        to={`/u/${organisation.username}`}
                        className="font-medium hover:underline"
                      >
                        {organisation.displayName}
                      </Link>
                    ) : (
                      <span className="font-medium">{organisation.displayName}</span>
                    )}
                    {organisation.username && (
                      <span className="text-xs text-muted-foreground">
                        @{organisation.username}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{organisation.typeName ?? '-'}</TableCell>
                <TableCell>
                  <div className="flex flex-col items-start gap-1">
                    <Badge variant={BADGE_VARIANTS[organisation.moderation]}>
                      {ModerationRecord[organisation.moderation]}
                    </Badge>
                    {organisation.isMapPin && (
                      <span className="text-xs text-muted-foreground">Map pin only</span>
                    )}
                  </div>
                </TableCell>
                <TableCell truncate className="max-w-28" title={organisation.about ?? undefined}>
                  {organisation.about ?? '-'}
                </TableCell>
                <TableCell
                  truncate
                  className="max-w-28"
                  title={organisation.moderationFeedback ?? undefined}
                >
                  {organisation.moderationFeedback ?? '-'}
                </TableCell>
                <TableCell variant="muted">
                  {CREATED_AT_FORMAT.format(organisation.createdAt)}
                </TableCell>
                <TableCell className="text-right">{organisation.id}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => setModerating(organisation)}>
                    Moderate
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AdminPagination page={page} totalPages={totalPages} />

      <ModerateOrganisationDialog
        organisation={moderating}
        onOpenChange={(open) => !open && setModerating(null)}
      />
    </div>
  );
}
