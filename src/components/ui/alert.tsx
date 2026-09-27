import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import { cn } from '@/lib/utils';

const alertVariants = cva(
  "group/alert relative grid w-full justify-items-start gap-0.5 rounded-s p-3 text-center text-base text-card-foreground has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-alert has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'border bg-card',
        destructive: 'bg-destructive/10 dark:bg-destructive/20',
        success: 'bg-success/10 dark:bg-success/20',
        warning: 'bg-warning/10 dark:bg-warning/20',
        info: 'bg-info/10 dark:bg-info/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

const alertTitleVariants = cva(
  'group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground',
  {
    variants: {
      // `lg` is the legacy `Heading variant="small"` treatment, used where an
      // alert titles a block of moderator feedback rather than a single line.
      size: {
        default: 'font-medium',
        lg: 'font-heading text-lg font-normal tracking-normal',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

function AlertTitle({
  className,
  size,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertTitleVariants>) {
  return (
    <div
      data-slot="alert-title"
      className={cn(alertTitleVariants({ size, className }))}
      {...props}
    />
  );
}

const alertDescriptionVariants = cva(
  '[&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-2',
  {
    variants: {
      size: {
        default: '',
        sm: 'text-sm',
        xs: 'text-xs',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

function AlertDescription({
  className,
  size,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertDescriptionVariants>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(alertDescriptionVariants({ size, className }))}
      {...props}
    />
  );
}

function AlertAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="alert-action" className={cn('absolute top-2 right-2', className)} {...props} />
  );
}

export {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
  alertDescriptionVariants,
  alertTitleVariants,
  alertVariants,
};
