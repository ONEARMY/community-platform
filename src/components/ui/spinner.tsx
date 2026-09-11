import { cn } from '@/lib/utils';

import SpinnerIcon from './icons/spinner.svg?react';

function Spinner({ className }: { className?: string }) {
  return (
    <SpinnerIcon
      data-slot="spinner"
      role="status"
      aria-label="Loading..."
      className={cn('size-4 animate-spin text-muted-foreground', className)}
    />
  );
}

export { Spinner };
