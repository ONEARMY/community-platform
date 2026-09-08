import { PencilIcon, PlusIcon } from 'lucide-react';
import type { Tag } from 'oa-shared';
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
import { TagFormDialog } from './TagFormDialog';

interface IProps {
  tags: Tag[];
}

export function TagsPage({ tags }: IProps) {
  const [editingTag, setEditingTag] = useState<Tag | null | undefined>(undefined);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Tags</h1>

        <Button size="sm" onClick={() => setEditingTag(null)}>
          <PlusIcon />
          New tag
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="w-0">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tags.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell>{tag.name}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Edit ${tag.name}`}
                  onClick={() => setEditingTag(tag)}
                >
                  <PencilIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TagFormDialog
        open={editingTag !== undefined}
        tag={editingTag ?? null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingTag(undefined);
          }
        }}
      />
    </div>
  );
}
