'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const labelVariants = cva(
  'flex items-center gap-2 text-sm leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
  {
    variants: {
      weight: {
        medium: 'font-medium',
        normal: 'font-normal',
      },
    },
    defaultVariants: {
      weight: 'medium',
    },
  },
);

function Label({
  className,
  weight = 'medium',
  ...props
}: React.ComponentProps<'label'> & VariantProps<typeof labelVariants>) {
  return (
    <label data-slot="label" className={cn(labelVariants({ weight, className }))} {...props} />
  );
}

export { Label, labelVariants };
