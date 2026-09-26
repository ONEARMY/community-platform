import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const skeletonVariants = cva('animate-pulse bg-muted', {
  variants: {
    shape: {
      default: 'rounded-md',
      rounded: 'rounded-xl',
      circle: 'rounded-full',
    },
  },
  defaultVariants: {
    shape: 'default',
  },
});

function Skeleton({
  className,
  shape = 'default',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof skeletonVariants>) {
  return (
    <div data-slot="skeleton" className={cn(skeletonVariants({ shape, className }))} {...props} />
  );
}

export { Skeleton, skeletonVariants };
