import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'flex flex-col gap-4 rounded-card bg-card py-4 text-card-foreground shadow-sm',
  {
    variants: {
      variant: {
        default: 'border',
        outline: 'border-2 border-outline',
        flat: 'gap-2.5 rounded-card-flat border-2 border-outline p-2.5 shadow-none sm:p-4 md:p-5',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Card({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof cardVariants>) {
  return <div data-slot="card" className={cn(cardVariants({ variant, className }))} {...props} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="card-header" className={cn('flex flex-col gap-1 px-4', className)} {...props} />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('text-sm font-medium leading-none', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

const cardContentVariants = cva('px-4', {
  variants: {
    variant: {
      default: '',
      muted: 'text-sm text-muted-foreground',
    },
    gap: {
      none: '',
      sm: 'gap-2',
      md: 'gap-4',
    },
  },
  defaultVariants: {
    variant: 'default',
    gap: 'none',
  },
});

function CardContent({
  className,
  variant = 'default',
  gap = 'none',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof cardContentVariants>) {
  return (
    <div
      data-slot="card-content"
      className={cn(cardContentVariants({ variant, gap, className }))}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="card-footer" className={cn('flex items-center px-4', className)} {...props} />
  );
}

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cardContentVariants,
  cardVariants,
};
