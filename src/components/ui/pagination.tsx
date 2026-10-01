import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import type { VariantProps } from 'class-variance-authority';
import { MoreHorizontalIcon } from 'lucide-react';
import type * as React from 'react';
import { buttonVariants } from '@/components/ui/button';
import ChevronLeftIcon from '@/components/ui/icons/chevron-left.svg?react';
import ChevronRightIcon from '@/components/ui/icons/chevron-right.svg?react';
import { cn } from '@/lib/utils';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn('flex w-full justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex flex-wrap items-center justify-center gap-0.5', className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = useRender.ComponentProps<'a'> &
  React.ComponentProps<'a'> & {
    isActive?: boolean;
    size?: VariantProps<typeof buttonVariants>['size'];
  };

function PaginationLink({
  render,
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) {
  return useRender({
    defaultTagName: 'a',
    props: mergeProps<'a'>(
      {
        'aria-current': isActive ? 'page' : undefined,
        className: cn(buttonVariants({ variant: isActive ? 'outline' : 'ghost', size }), className),
      },
      props,
    ),
    render,
    state: {
      slot: 'pagination-link',
      active: isActive,
    },
  });
}

function PaginationPrevious({
  text = 'Previous',
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink aria-label="Go to previous page" size="default" {...props}>
      <ChevronLeftIcon data-icon="inline-start" />
      <span className="hidden sm:block">{text}</span>
    </PaginationLink>
  );
}

function PaginationNext({
  text = 'Next',
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink aria-label="Go to next page" size="default" {...props}>
      <span className="hidden sm:block">{text}</span>
      <ChevronRightIcon data-icon="inline-end" />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
