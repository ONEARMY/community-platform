import { VerticalList } from 'oa-components';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface SelectableHorizontalListItem {
  id: string | number;
  label: string;
  imageUrl?: string | null;
}

interface SelectableHorizontalListProps {
  items: SelectableHorizontalListItem[];
  selectedId?: string | number;
  onSelect: (id: string | number | null) => void;
  dataCy?: string;
}

export function SelectableHorizontalList({
  items,
  selectedId,
  onSelect,
  dataCy,
}: SelectableHorizontalListProps) {
  if (!items.length) {
    return null;
  }

  return (
    <VerticalList dataCy={dataCy}>
      {items.map((item) => {
        const isSelected = item.id === selectedId;

        return (
          <Button
            key={item.id}
            type="button"
            variant="ghost"
            aria-pressed={isSelected}
            data-cy={`${dataCy}-Item${isSelected ? '-active' : ''}`}
            data-testid={`${dataCy}-Item`}
            title={item.label}
            onClick={() => onSelect(isSelected ? null : item.id)}
            className={cn(
              'mx-1 flex h-auto shrink-0 flex-col items-center justify-center rounded-lg bg-transparent py-2 text-center',
              'min-w-20 w-20 md:min-w-[100px] md:w-[100px] lg:min-w-[130px] lg:w-[130px]',
              isSelected
                ? 'border-b-2 border-green-600 hover:border-green-600'
                : 'border-b-2 border-transparent hover:border-b-2 hover:border-foreground',
            )}
          >
            {item.imageUrl && <img src={item.imageUrl} alt="" className="size-10 object-contain" />}

            <span className="text-sm text-muted-foreground">{item.label}</span>
          </Button>
        );
      })}
    </VerticalList>
  );
}
