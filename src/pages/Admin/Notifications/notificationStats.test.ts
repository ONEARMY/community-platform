import { describe, expect, it } from 'vitest';
import {
  formatShare,
  percentage,
  preferenceRows,
  typeLabel,
  weekLabel,
  weekRange,
} from './notificationStats';

describe('notificationStats', () => {
  it('labels the current week and leaves complete weeks plain', () => {
    expect(weekLabel('2026-11-16', false)).toBe('16 Nov');
    expect(weekLabel('2026-11-16', true)).toBe('16 Nov (current)');
  });

  it('gives the Monday to Sunday range, crossing a year end', () => {
    expect(weekRange('2026-11-16')).toBe('16 Nov - 22 Nov 2026');
    expect(weekRange('2026-12-28')).toBe('28 Dec - 3 Jan 2027');
  });

  it('shows count and percentage, and copes with a zero total', () => {
    expect(formatShare(1, 3)).toBe('1 (33.3%)');
    expect(percentage(0, 0)).toBe(0);
  });

  it('combines action and content type, falling back to the raw value', () => {
    expect(typeLabel('newComment', 'comments')).toBe('New comment · Comments');
    expect(typeLabel('other', 'unknown')).toBe('other · unknown');
  });

  it('builds one row per preference', () => {
    const rows = preferenceRows({
      total: 4,
      comments: { enabled: 3, disabled: 1 },
      replies: { enabled: 4, disabled: 0 },
      research_updates: { enabled: 2, disabled: 2 },
      content_reach: { all: 1, important: 2, unset: 1 },
    });

    expect(rows.map((row) => row.label)).toEqual([
      'Comments',
      'Replies',
      'Research updates',
      'Content reach',
    ]);
    expect(rows[3].values).toEqual({ all: 1, important: 2, unset: 1 });
  });
});
