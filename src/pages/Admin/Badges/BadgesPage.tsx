import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { Thumbnail } from 'src/pages/Admin/Thumbnail';
import type { AdminProfileBadge } from 'src/utils/profileBadges';
import { BADGE_AVAILABILITY_OPTIONS, getProfileBadgeDeleteError } from 'src/utils/profileBadges';
import { useToast } from '@/common/Toast';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BadgeFormDialog } from './BadgeFormDialog';
import { DeleteBadgeDialog } from './DeleteBadgeDialog';

interface IProps {
  profileBadges: AdminProfileBadge[];
}

export function BadgesPage({ profileBadges }: IProps) {
  const [editingBadge, setEditingBadge] = useState<AdminProfileBadge | null | undefined>(undefined);
  const [deletingBadge, setDeletingBadge] = useState<AdminProfileBadge | null>(null);
  const toast = useToast();

  const displayNames = new Map(profileBadges.map(({ badge }) => [badge.id, badge.displayName]));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Badges</h1>
        <Button size="sm" onClick={() => setEditingBadge(null)}>
          <PlusIcon />
          New Badge
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Display Name</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Audience</TableHead>
            <TableHead>Grants</TableHead>
            <TableHead>Offered To</TableHead>
            <TableHead>Holders</TableHead>
            <TableHead>Articles</TableHead>
            <TableHead className="w-0">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profileBadges.map((profileBadge) => {
            const { badge, usage } = profileBadge;
            const deleteError = getProfileBadgeDeleteError(badge.id, profileBadges);

            return (
              <TableRow key={badge.id}>
                <TableCell>
                  <Thumbnail imageUrl={badge.imageUrl} alt={badge.displayName} />
                </TableCell>
                <TableCell>{badge.displayName}</TableCell>
                <TableCell>{badge.name}</TableCell>
                <TableCell>{badge.isAudience ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  {(badge.grantsBadgeId && displayNames.get(badge.grantsBadgeId)) || '—'}
                </TableCell>
                <TableCell>
                  {BADGE_AVAILABILITY_OPTIONS.find((option) => option.value === badge.availableTo)
                    ?.label || '—'}
                </TableCell>
                <TableCell>{usage.holders}</TableCell>
                <TableCell>{usage.articles}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit ${badge.displayName}`}
                      onClick={() => setEditingBadge(profileBadge)}
                    >
                      <PencilIcon />
                    </Button>
                    {deleteError ? (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Can't delete ${badge.displayName}`}
                        onClick={() => toast.info(deleteError)}
                        style={{ color: 'gray' }}
                      >
                        <TrashIcon />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${badge.displayName}`}
                        onClick={() => setDeletingBadge(profileBadge)}
                      >
                        <TrashIcon />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <BadgeFormDialog
        open={editingBadge !== undefined}
        profileBadge={editingBadge ?? null}
        profileBadges={profileBadges}
        onOpenChange={(open) => {
          if (!open) {
            setEditingBadge(undefined);
          }
        }}
      />

      <DeleteBadgeDialog
        profileBadge={deletingBadge}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingBadge(null);
          }
        }}
      />
    </div>
  );
}
