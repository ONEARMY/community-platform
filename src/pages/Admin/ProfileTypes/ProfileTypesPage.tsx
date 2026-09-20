import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import type { ProfileType } from 'oa-shared';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DeleteProfileTypeDialog } from './DeleteProfileTypeDialog';
import { ProfileTypeFormDialog } from './ProfileTypeFormDialog';

interface IProps {
  profileTypes: ProfileType[];
}

export function ProfileTypesPage({ profileTypes }: IProps) {
  const [editingProfileType, setEditingProfileType] = useState<ProfileType | null | undefined>(
    undefined,
  );
  const [deletingProfileType, setDeletingProfileType] = useState<ProfileType | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Profile Types</h1>
        <Button size="sm" onClick={() => setEditingProfileType(null)}>
          <PlusIcon />
          New Profile Type
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-0">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profileTypes.map((profileType) => (
            <TableRow key={profileType.id}>
              <TableCell>{profileType.name}</TableCell>
              <TableCell className="max-w-xs truncate text-muted-foreground">
                {profileType.description}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${profileType.name}`}
                    onClick={() => setEditingProfileType(profileType)}
                  >
                    <PencilIcon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete ${profileType.name}`}
                    onClick={() => setDeletingProfileType(profileType)}
                  >
                    <TrashIcon />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ProfileTypeFormDialog
        open={editingProfileType !== undefined}
        profileType={editingProfileType ?? null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingProfileType(undefined);
          }
        }}
      />

      <DeleteProfileTypeDialog
        profileType={deletingProfileType}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingProfileType(null);
          }
        }}
      />
    </div>
  );
}
