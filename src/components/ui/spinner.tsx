import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

import SpinnerIcon from './icons/spinner.svg?react';

interface SpinnerProps {
  className?: string;
  label?: ReactNode;
}

function Spinner({ className, label }: SpinnerProps) {
  return (
    <div className={cn('flex w-full flex-wrap justify-center', className)}>
      <SpinnerIcon
        data-slot="spinner"
        role="status"
        aria-label="Loading..."
        className="size-[48px] animate-spin text-muted-foreground"
      />
      {label && <span className="w-full text-center text-base">{label}</span>}
    </div>
  );
}

export { Spinner };
