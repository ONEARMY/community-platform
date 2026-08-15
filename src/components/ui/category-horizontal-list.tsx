import type { Category } from 'oa-shared';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CategoryHorizontalListProps {
  activeCategory: Category | null;
  allCategories: Category[];
  setActiveCategory: (category: Category | null) => void;
}

export function CategoryHorizontalList({
  activeCategory,
  allCategories,
  setActiveCategory,
}: CategoryHorizontalListProps) {
  if (!allCategories?.length) {
    return null;
  }

  const orderedCategories = allCategories
    .slice()
    .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));

  return (
    <div data-cy="CategoryHorizonalList" className="flex overflow-x-auto">
      {orderedCategories.map((category) => {
        const isSelected = category.id === activeCategory?.id;

        return (
          <Button
            key={category.id}
            type="button"
            variant="ghost"
            aria-pressed={isSelected}
            data-cy={`CategoryHorizonalList-Item${isSelected ? '-active' : ''}`}
            data-testid="CategoryHorizonalList-Item"
            title={category.name}
            onClick={() => setActiveCategory(isSelected ? null : category)}
            className={cn(
              'mx-1 flex h-auto min-w-20 flex-col items-center justify-center rounded-lg border-2 py-2 text-center md:min-w-[100px] lg:min-w-[130px]',
              isSelected ? 'border-foreground' : 'border-transparent',
            )}
          >
            {category.imageUrl && (
              <img src={category.imageUrl} alt="" className="size-10 object-contain" />
            )}

            <span className="text-sm">{category.name}</span>
          </Button>
        );
      })}
    </div>
  );
}
