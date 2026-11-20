import { Badge } from '@/components/ui/badge';

export function ModerationBadge({ status }: { status: string }) {
  const variant =
    status === 'accepted'
      ? 'success'
      : status === 'awaiting-moderation'
        ? 'warning'
        : status === 'improvements-needed'
          ? 'info'
          : 'destructive';

  return <Badge variant={variant}>{status}</Badge>;
}
