import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const textareaVariants = cva('flex field-sizing-content w-full outline-none', {
  variants: {
    variant: {
      default:
        'min-h-16 rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
      caption:
        'rounded-none border-none bg-transparent p-0 text-sm leading-normal text-caption shadow-none placeholder:text-muted-foreground focus-visible:border-transparent focus-visible:ring-0',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

function Textarea({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'textarea'> & VariantProps<typeof textareaVariants>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Textarea, textareaVariants };
