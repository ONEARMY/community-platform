import { jsxs as _jsxs } from 'react/jsx-runtime';
import { cn } from '@/lib/utils';
export function CharacterCount({ currentSize, maxSize, minSize, className, ...props }) {
  const remaining = maxSize - currentSize;
  const percentage = currentSize / Math.max(maxSize, 1);
  let colorClass = 'text-muted-foreground';
  if (percentage >= 1 || (minSize !== undefined && currentSize < minSize)) {
    colorClass = 'text-destructive font-bold';
  } else if (percentage >= 0.95) {
    colorClass = 'text-warning font-bold';
  } else if (percentage >= 0.9) {
    colorClass = 'text-success font-bold';
  }
  return _jsxs('p', {
    className: cn('absolute -bottom-5 right-1 ml-auto self-end text-xs', colorClass, className),
    'data-cy': 'character-count',
    ...props,
    children: [remaining, ' characters remaining'],
  });
}
