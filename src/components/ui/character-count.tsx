import { cn } from '@/lib/utils';

export interface CharacterCountProps {
  current: number;
  max: number;
  className?: string;
}

export function CharacterCount({ current, max, className }: CharacterCountProps) {
  return (
    <p
      data-slot="character-count"
      data-cy="character-count"
      className={cn(
        'ml-auto text-sm text-muted-foreground',
        current >= max && 'font-bold text-destructive',
        className,
      )}
    >
      {current} / {max}
    </p>
  );
}
