import type { Category } from 'oa-shared';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import ChevronLeftIcon from '@/components/ui/icons/chevron-left.svg?react';
import ChevronRightIcon from '@/components/ui/icons/chevron-right.svg?react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export const CategoryHorizontalList = ({
  activeCategory,
  allCategories,
  setActiveCategory,
}: {
  activeCategory: Category | null;
  allCategories: Category[];
  setActiveCategory: (category: Category | null) => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState({ start: false, end: false });

  const updateOverflow = useCallback(() => {
    const element = scrollRef.current;
    if (!element) {
      return;
    }
    setOverflow({
      start: element.scrollLeft > 0,
      end: element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
    });
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) {
      return;
    }
    updateOverflow();
    const observer = new ResizeObserver(updateOverflow);
    observer.observe(element);
    return () => observer.disconnect();
  }, [updateOverflow, allCategories.length]);

  if (!allCategories.length) {
    return null;
  }

  const orderedCategories = allCategories
    .slice()
    .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));

  const scroll = (direction: -1 | 1) => {
    const element = scrollRef.current;
    element?.scrollBy({ left: (direction * element.clientWidth) / 2, behavior: 'smooth' });
  };

  const handleValueChange = (value: string[]) => {
    setActiveCategory(
      orderedCategories.find((category) => String(category.id) === value[0]) ?? null,
    );
  };

  return (
    <div data-cy="CategoryHorizonalList" className="flex max-w-full items-center gap-1 px-2">
      {overflow.start && (
        <Button
          variant="outline"
          size="icon-lg"
          tabIndex={-1}
          aria-hidden
          onClick={() => scroll(-1)}
        >
          <ChevronLeftIcon />
        </Button>
      )}
      <div
        ref={scrollRef}
        onScroll={updateOverflow}
        className="scrollbar-none min-w-0 overflow-x-auto p-1"
      >
        <ToggleGroup
          aria-label="Filter by category"
          variant="tile"
          size="tile"
          value={activeCategory ? [String(activeCategory.id)] : []}
          onValueChange={handleValueChange}
        >
          {orderedCategories.map((category) => {
            const isSelected = category.id === activeCategory?.id;

            return (
              <ToggleGroupItem
                key={category.id}
                value={String(category.id)}
                data-cy={`CategoryHorizonalList-Item${isSelected ? '-active' : ''}`}
              >
                {category.imageUrl && <img src={category.imageUrl} alt="" className="size-8" />}
                {category.name}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>
      {overflow.end && (
        <Button
          variant="outline"
          size="icon-lg"
          tabIndex={-1}
          aria-hidden
          onClick={() => scroll(1)}
        >
          <ChevronRightIcon />
        </Button>
      )}
    </div>
  );
};
