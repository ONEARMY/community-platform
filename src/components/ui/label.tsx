'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const labelVariants = cva(
  'flex items-center gap-2 leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
  {
    variants: {
      weight: {
        medium: 'font-medium',
        normal: 'font-normal',
      },
      size: {
        default: 'text-sm',
        base: 'text-base',
      },
    },
    defaultVariants: {
      weight: 'medium',
      size: 'default',
    },
  },
);

function Label({
  className,
  weight = 'medium',
  size = 'default',
  ...props
}: React.ComponentProps<'label'> & VariantProps<typeof labelVariants>) {
  return (
    <label
      data-slot="label"
      className={cn(labelVariants({ weight, size, className }))}
      {...props}
    />
  );
}

export { Label, labelVariants };
