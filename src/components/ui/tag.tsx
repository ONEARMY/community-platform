import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type TagProps = Omit<ComponentProps<'span'>, 'children'> & {
  label: string;
};

function Tag({ label, className, ...props }: TagProps) {
  if (!label) {
    return null;
  }

  return (
    <span data-slot="tag" className={cn('text-xs/normal text-blue', className)} {...props}>
      #{label}
    </span>
  );
}

export { Tag };
