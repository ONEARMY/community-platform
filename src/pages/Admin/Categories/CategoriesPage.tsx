import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import type { Category, ContentType } from 'oa-shared';
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
import { CategoryFormDialog } from './CategoryFormDialog';
import { DeleteCategoryDialog } from './DeleteCategoryDialog';

const CATEGORY_TYPE_LABELS: Record<ContentType, string> = {
  questions: 'Questions',
  projects: 'Projects',
  research: 'Research',
  news: 'News',
};

interface IProps {
  categories: Category[];
}

export function CategoriesPage({ categories }: IProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null | undefined>(undefined);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Categories</h1>
        <Button size="sm" onClick={() => setEditingCategory(null)}>
          <PlusIcon />
          New category
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-0">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>{CATEGORY_TYPE_LABELS[category.type]}</TableCell>
              <TableCell className="max-w-xs truncate text-muted-foreground">
                {category.description}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${category.name}`}
                    onClick={() => setEditingCategory(category)}
                  >
                    <PencilIcon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete ${category.name}`}
                    onClick={() => setDeletingCategory(category)}
                  >
                    <TrashIcon />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CategoryFormDialog
        open={editingCategory !== undefined}
        category={editingCategory ?? null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingCategory(undefined);
          }
        }}
      />

      <DeleteCategoryDialog
        category={deletingCategory}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingCategory(null);
          }
        }}
      />
    </div>
  );
}
