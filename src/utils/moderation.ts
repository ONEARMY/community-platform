import type { Moderation } from 'oa-shared';
import type { ComponentProps } from 'react';
import type { Badge } from '@/components/ui/badge';

export const MODERATION_BADGE_VARIANTS: Record<
  Moderation,
  ComponentProps<typeof Badge>['variant']
> = {
  'awaiting-moderation': 'warning',
  'improvements-needed': 'info',
  rejected: 'destructive',
  accepted: 'success',
};
