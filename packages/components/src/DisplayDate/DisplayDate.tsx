import { differenceInSeconds, format, formatDistanceToNow } from 'date-fns';
import { Text } from 'theme-ui';

import './display-date.css';

type DateType = string | number | Date;

export interface IProps {
  createdAt: DateType;
  publishedAction?: string;
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

  const displayDate = publishedAt || createdAt;
  const targetDate = new Date(modifiedAt || displayDate);

  const formattedDate = format(targetDate, 'dd-MM-yyyy HH:mm');
  const relativeDate = formatDistanceToNow(targetDate, { addSuffix: true });
  const shortRelativeDate = formatDistanceShort(targetDate);

  const getLabel = () => {
    const modifiedTime = modifiedAt ? new Date(modifiedAt).getTime() : null;
    const publishedTime = publishedAt ? new Date(publishedAt).getTime() : null;
    const createdTime = new Date(createdAt).getTime();

    // Published and modified AFTER publishing
    if (publishedTime && modifiedTime && modifiedTime > publishedTime) {
      return 'Updated';
    }
    // Published (not modified after)
    if (publishedTime) {
      return publishedAction;
    }
    // Draft that was edited
    if (modifiedTime && modifiedTime > createdTime) {
      return 'Updated';
    }
    // Draft, never edited
    return 'Created';
  };

  const label = getLabel();

  return (
    <Text title={formattedDate}>
      {/* Mobile version - show short format */}
      <span className="date-mobile">
        {showLabel && `${label} `}
        {shortRelativeDate}
      </span>

      {/* Desktop version - show full format */}
      <span className="date-desktop">
        {showLabel && `${label} `}
        {relativeDate}
      </span>
    </Text>
  );
};

function formatDistanceShort(date: Date, addSuffix = false) {
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
      return addSuffix ? `${count}${interval.label} ago` : `${count}${interval.label}`;
    }
  }

  return 'now';
}
