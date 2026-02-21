import { differenceInSeconds, format, formatDistanceToNow } from 'date-fns';
import { Text } from 'theme-ui';

import './display-date.css';

type DateType = string | number | Date;

export interface IProps {
  createdAt: DateType;
  publishedAction?: 'Published' | 'Started' | 'Asked';
  showLabel?: boolean;
  modifiedAt?: DateType | null;
  publishedAt?: DateType | null;
}

export const DisplayDate = (props: IProps) => {
  const {
    createdAt,
    modifiedAt,
    publishedAt,
    publishedAction = 'Published',
    showLabel = true,
  } = props;

  const modifiedTime = modifiedAt ? new Date(modifiedAt).getTime() : null;
  const publishedTime = publishedAt ? new Date(publishedAt).getTime() : null;
  const createdTime = new Date(createdAt).getTime();

  const primaryDate = new Date(publishedAt || createdAt);
  const primaryLabel = publishedTime ? publishedAction : 'Created';

  const wasEdited =
    modifiedTime &&
    ((publishedTime && modifiedTime > publishedTime) ||
      (!publishedTime && modifiedTime > createdTime));

  const modifiedDate = modifiedAt ? new Date(modifiedAt) : null;

  const primaryFormatted = format(primaryDate, 'dd-MM-yyyy HH:mm');
  const primaryRelative = formatDistanceToNow(primaryDate, { addSuffix: true });
  const primaryShort = formatDistanceShort(primaryDate);

  const modifiedFormatted = modifiedDate ? format(modifiedDate, 'dd-MM-yyyy HH:mm') : '';
  const modifiedRelative = modifiedDate
    ? formatDistanceToNow(modifiedDate, { addSuffix: true })
    : '';
  const modifiedShort = modifiedDate ? formatDistanceShort(modifiedDate) : '';

  return (
    <Text
      title={wasEdited ? `${primaryFormatted} (edited ${modifiedFormatted})` : primaryFormatted}
    >
      {/* Mobile version - show short format */}
      <span className="date-mobile">
        {showLabel && `${primaryLabel} `}
        {primaryShort}
        {wasEdited ? `. Edited ${modifiedShort}.` : '.'}
      </span>

      {/* Desktop version - show full format */}
      <span className="date-desktop">
        {showLabel && `${primaryLabel} `}
        {primaryRelative}
        {wasEdited ? `. Last edit ${modifiedRelative}.` : '.'}
      </span>
    </Text>
  );
};

function formatDistanceShort(date: Date) {
  const seconds = Math.abs(differenceInSeconds(new Date(), date));

  const intervals = [
    { label: 'y', seconds: 31536000 },
    { label: 'mo', seconds: 2628000 },
    { label: 'w', seconds: 604800 },
    { label: 'd', seconds: 86400 },
    { label: 'h', seconds: 3600 },
    { label: 'm', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count}${interval.label}`;
    }
  }

  return 'now';
}
