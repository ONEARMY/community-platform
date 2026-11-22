import type { NotificationStats } from 'oa-shared';

export const ACTION_LABELS: Record<string, string> = {
  newComment: 'New comment',
  newContent: 'New content',
  newReply: 'New reply',
  newNews: 'New news',
};

export const CONTENT_LABELS: Record<string, string> = {
  news: 'News',
  research: 'Research',
  researchUpdate: 'Research update',
  library: 'Library',
  questions: 'Questions',
  comment: 'Comment',
  reply: 'Reply',
  research_updates: 'Research updates',
  comments: 'Comments',
  projects: 'Projects',
};

export const actionLabel = (value: string) => ACTION_LABELS[value] ?? value;
export const contentLabel = (value: string) => CONTENT_LABELS[value] ?? value;
export const typeLabel = (actionType: string, contentType: string) =>
  `${actionLabel(actionType)} · ${contentLabel(contentType)}`;

const DAY_MONTH = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
});
const DAY_MONTH_YEAR = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const DAY_MS = 24 * 60 * 60 * 1000;

export const weekLabel = (weekStart: string, isCurrent: boolean) =>
  `${DAY_MONTH.format(new Date(weekStart))}${isCurrent ? ' (current)' : ''}`;

// Monday to Sunday, for the tooltip
export const weekRange = (weekStart: string) => {
  const start = new Date(weekStart);
  const end = new Date(start.getTime() + 6 * DAY_MS);
  return `${DAY_MONTH.format(start)} - ${DAY_MONTH_YEAR.format(end)}`;
};

export const percentage = (value: number, total: number) =>
  total > 0 ? Math.round((value / total) * 1000) / 10 : 0;

export const formatShare = (value: number, total: number) =>
  `${value} (${percentage(value, total)}%)`;

export interface PreferenceRow {
  key: string;
  label: string;
  values: Record<string, number>;
}

export const preferenceRows = (preferences: NotificationStats['preferences']): PreferenceRow[] => [
  { key: 'comments', label: 'Comments', values: { ...preferences.comments } },
  { key: 'replies', label: 'Replies', values: { ...preferences.replies } },
  {
    key: 'research_updates',
    label: 'Research updates',
    values: { ...preferences.research_updates },
  },
  { key: 'content_reach', label: 'Content reach', values: { ...preferences.content_reach } },
];
