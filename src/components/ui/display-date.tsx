import { differenceInSeconds, format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

type DateType = string | number | Date;

export type PublishedAction = 'Published' | 'Started' | 'Asked';

const SHORT_UNITS = [
  { label: 'y', seconds: 31536000 },
  { label: 'mo', seconds: 2628000 },
  { label: 'w', seconds: 604800 },
  { label: 'd', seconds: 86400 },
  { label: 'h', seconds: 3600 },
  { label: 'm', seconds: 60 },
];

/** "30 minutes ago" -> "30m ago" */
const formatDistanceShort = (date: Date) => {
  const elapsed = Math.abs(differenceInSeconds(new Date(), date));
  const unit = SHORT_UNITS.find(({ seconds }) => elapsed >= seconds);
  return unit ? `${Math.floor(elapsed / unit.seconds)}${unit.label} ago` : 'now';
};

export interface DisplayDateProps {
  createdAt: DateType;
  publishedAction?: PublishedAction;
  showLabel?: boolean;
  modifiedAt?: DateType | null;
  publishedAt?: DateType | null;
  className?: string;
}

/**
 * Relative timestamp, abbreviated below `md` so it survives narrow layouts.
 * Both formats render; CSS picks one, which keeps it SSR-safe.
 */
export function DisplayDate({
  createdAt,
  modifiedAt,
  publishedAt,
  publishedAction = 'Published',
  showLabel = true,
  className,
}: DisplayDateProps) {
  const modifiedTime = modifiedAt ? new Date(modifiedAt).getTime() : null;
  const publishedTime = publishedAt ? new Date(publishedAt).getTime() : null;
  const createdTime = new Date(createdAt).getTime();

  const primaryDate = new Date(publishedAt || createdAt);
  const primaryLabel = publishedTime ? publishedAction : 'Created';
  const modifiedDate = modifiedAt ? new Date(modifiedAt) : null;

  const wasEdited =
    modifiedTime &&
    ((publishedTime && modifiedTime > publishedTime) ||
      (!publishedTime && modifiedTime > createdTime));

  const primaryFormatted = format(primaryDate, 'dd-MM-yyyy HH:mm');
  const modifiedFormatted = modifiedDate ? format(modifiedDate, 'dd-MM-yyyy HH:mm') : '';

  const label = showLabel ? `${primaryLabel} ` : '';

  return (
    <time
      data-slot="display-date"
      dateTime={primaryDate.toISOString()}
      title={wasEdited ? `${primaryFormatted} (edited ${modifiedFormatted})` : primaryFormatted}
      className={cn(className)}
    >
      <span className="md:hidden">
        {label}
        {formatDistanceShort(primaryDate)}
        {wasEdited && modifiedDate ? `. Edited ${formatDistanceShort(modifiedDate)}` : ''}
      </span>
      <span className="hidden md:inline">
        {label}
        {formatDistanceToNow(primaryDate, { addSuffix: true })}
        {wasEdited && modifiedDate
          ? `. Last edit ${formatDistanceToNow(modifiedDate, { addSuffix: true })}`
          : ''}
      </span>
    </time>
  );
}
